import cds from '@sap/cds';

export default class EmployeeServiceHandler extends cds.ApplicationService {
  async init() {
    const { Employees, LearningsMasterData } = this.entities;
    const db = await cds.connect.to('db');

    const { Employees: dbEmployees } = cds.entities('db');

    // ── Helper: get next sequential employee ID ──────────────────────
    async function getNextEmployeeID() {
      const last = await db.run(
        SELECT.one.from(dbEmployees).columns('employeeID').orderBy('employeeID desc')
      );
      let nextNum = 10001;

      if (last?.employeeID) {
        const num = parseInt(last.employeeID.replace(/^[iI]/, ''), 10);
        if (!isNaN(num)) nextNum = num + 1;
      }
      return `I${String(nextNum).padStart(5, '0')}`;
    }

    // ── Helper: generate unique email ─────────────────────────────────
    async function generateUniqueEmail(firstName: string, lastName: string) {
      const f = (firstName || '').trim().toLowerCase();
      const l = (lastName || '').trim().toLowerCase();
      if (!f || !l) return null;

      const base = `${f}.${l}`;
      const matches = await db.run(
        SELECT.from(dbEmployees)
          .columns('email')
          .where({ email: { like: `${base}%@sap.com` } })
      );

      const taken = new Set(matches.map((e: any) => e.email));
      let email = `${base}@sap.com`;
      let counter = 1;
      
      while (taken.has(email)) {
        email = `${base}${counter}@sap.com`;
        counter++;
      }
      return email;
    }

    // ── Calculate remaining leaves after read ────────────────────
    this.after('READ', 'Employees', (employees: any) => {
      // Guard: no data
      if (!employees) return;

      // Normalize to array
      const employeeList = Array.isArray(employees) ? employees : [employees];

      for (const employee of employeeList) {
        const leavesGranted = employee.annualLeavesGranted ?? 0;
        const leavesUsed = employee.annualLeavesUsed ?? 0;

        // Guard: invalid input → set null and skip
        if (leavesUsed < 0 || leavesUsed > leavesGranted) {
          employee.remainingLeaves = null;
          continue;
        }

        // Happy path: calculate remaining leaves
        employee.remainingLeaves = leavesGranted - leavesUsed;

        // Action availability: disable on drafts or based on status
        // IsActiveEntity is true for saved entities, false for drafts, might be undefined in some contexts
        const isActiveEntity = employee.IsActiveEntity !== false;
        employee.isDeactivatable = isActiveEntity && employee.status === 'Active';
        employee.isDeletable = isActiveEntity && employee.status === 'Obsolete';
      }
    });

    // ── Defaults when a new draft is created ────────────────────────
    this.before('CREATE', 'Employees.drafts', async (req) => {
      req.data.employeeID = await getNextEmployeeID();
      req.data.status = 'InPreparation';
      req.data.annualLeavesGranted = 20;
      req.data.annualLeavesUsed = 0;
      req.data.joiningDate = new Date().toISOString().slice(0, 10);
    });

    // ── Auto-assign initial (Beginner) learnings after draft is created ──
    this.after('CREATE', 'Employees.drafts', async (data) => {
      const beginnerCourses = await SELECT.from(LearningsMasterData)
          .where({ initialLevel: true });
      if (beginnerCourses.length === 0) return;

      const today = new Date().toISOString().slice(0, 10);
      for (const course of beginnerCourses) {
        await INSERT.into('EmployeeService.Learnings.drafts').entries({
          ID: cds.utils.uuid(),
          employee_ID: data.ID,
          learningMaster_ID: course.ID,
          status: 'Assigned',
          assignedDate: today,
          DraftAdministrativeData_DraftUUID: data.DraftAdministrativeData_DraftUUID,
          IsActiveEntity: false,
          HasActiveEntity: false,
        });
      }
    });

    // ── Auto-generate email and activate on Save ─────────────────────
    this.before('SAVE', 'Employees', async (req) => {
      // Required field validations
      if (!req.data.firstName?.trim()) {
        return req.reject(400, 'First name is required');
      }
      if (!req.data.lastName?.trim()) {
        return req.reject(400, 'Last name is required');
      }
      if (!req.data.joiningDate) {
        return req.reject(400, 'Joining date is required');
      }
      if (!req.data.phoneNumber?.trim()) {
        return req.reject(400, 'Phone number is required');
      }
      if (!req.data.department?.trim()) {
        return req.reject(400, 'Department is required');
      }
      if (!req.data.role?.trim()) {
        return req.reject(400, 'Role is required');
      }

      // Format validations
      const nameRegex = /^[a-zA-Z\s'-]+$/;
      if (!nameRegex.test(req.data.firstName)) {
        return req.reject(400, 'First name must contain only letters, spaces, hyphens, or apostrophes');
      }
      if (!nameRegex.test(req.data.lastName)) {
        return req.reject(400, 'Last name must contain only letters, spaces, hyphens, or apostrophes');
      }

      // Phone number: exactly 10 numeric digits
      if (!/^\d{10}$/.test(req.data.phoneNumber)) {
        return req.reject(400, 'Phone number must be exactly 10 digits');
      }

      // Role: letters, numbers, spaces, hyphens, / (e.g., "SDE2", "Senior Developer")
      if (!/^[a-zA-Z0-9\s\-\/]+$/.test(req.data.role)) {
        return req.reject(400, 'Role must contain only letters, numbers, spaces, hyphens, or /');
      }

      // Department: letters, spaces, &, - (e.g., "R&D", "Human Resources")
      if (!/^[a-zA-Z\s&\-]+$/.test(req.data.department)) {
        return req.reject(400, 'Department must contain only letters, spaces, & or hyphens');
      }

      // Bank details: if any one is provided, all three are required
      const hasBankName = !!req.data.bankName?.trim();
      const hasBankCode = !!req.data.bankCode?.trim();
      const hasBankAccount = !!req.data.bankAccountNumber?.trim();
      if (hasBankName || hasBankCode || hasBankAccount) {
        if (!hasBankName) {
          return req.reject(400, 'Bank name is required when providing bank details');
        }
        if (!hasBankCode) {
          return req.reject(400, 'Bank code is required when providing bank details');
        }
        if (!hasBankAccount) {
          return req.reject(400, 'Bank account number is required when providing bank details');
        }
      }

      // Bank Code: 8-11 alphanumeric (SWIFT/BIC format)
      if (req.data.bankCode && !/^[A-Z0-9]{8,11}$/i.test(req.data.bankCode)) {
        return req.reject(400, 'Bank code must be 8-11 alphanumeric characters');
      }

      // Bank Name: letters, spaces, &, . (e.g., "State Bank of India", "HDFC Bank Ltd.")
      if (req.data.bankName && !/^[a-zA-Z\s&.]+$/.test(req.data.bankName)) {
        return req.reject(400, 'Bank name must contain only letters, spaces, & or .');
      }

      // Bank Account Number: 8-20 digits
      if (req.data.bankAccountNumber && !/^\d{8,20}$/.test(req.data.bankAccountNumber)) {
        return req.reject(400, 'Bank account number must be 8-20 digits');
      }

      if (req.data.bankAccountNumber) {
        const duplicate = await SELECT.one.from(Employees)
          .columns('employeeID', 'firstName', 'lastName')
          .where({ bankAccountNumber: req.data.bankAccountNumber, ID: { '!=': req.data.ID } });
        if (duplicate) {
          return req.reject(400, `Bank account number ${req.data.bankAccountNumber} is already assigned to employee ${duplicate.employeeID} : ${duplicate.firstName} ${duplicate.lastName}`);
        }
      }

      if (req.data.ratings?.length) {
        for (const r of req.data.ratings) {
          // Required field validations
          if (!r.year?.trim()) {
            return req.reject(400, 'Rating year is required');
          }
          if (r.rating === undefined || r.rating === null) {
            return req.reject(400, 'Rating value is required');
          }
          if (!r.reviewerID?.trim()) {
            return req.reject(400, 'Reviewer ID is required');
          }
          // Format validations
          if (!/^[a-zA-Z0-9]+$/.test(r.reviewerID)) {
            return req.reject(400, 'Reviewer ID must contain only letters and numbers');
          }
          if (r.rating < 1 || r.rating > 5) {
            return req.reject(400, `Rating must be between 1 and 5. Got: ${r.rating}`);
          }
          if (!/^\d{4}$/.test(r.year) || parseInt(r.year) < 2000 || parseInt(r.year) > new Date().getFullYear()) {
            return req.reject(400, `Year must be between 2000 and ${new Date().getFullYear()}. Got: ${r.year}`);
          }
        }
      }

      if (req.data.assignedLearnings?.length) {
        for (const l of req.data.assignedLearnings) {
          // Required field validations
          if (!l.learningMaster_ID) {
            return req.reject(400, 'Learning is required');
          }
          if (!l.assignedDate) {
            return req.reject(400, 'Learning assigned date is required');
          }
          // Date validations
          if (l.completedDate && l.completedDate < l.assignedDate) {
            return req.reject(400, 'Learning completed date cannot be before assigned date');
          }
        }
      }

      if (req.data.assignedProjects?.length) {
        for (const p of req.data.assignedProjects) {
          // If project is assigned, assigned date is required
          if (!p.projectMaster_ID) {
            return req.reject(400, 'Project is required');
          }
          if (!p.assignedDate) {
            return req.reject(400, 'Project assigned date is required');
          }
          // Date validations
          if (p.completedDate && p.completedDate < p.assignedDate) {
            return req.reject(400, 'Project completed date cannot be before assigned date');
          }
        }
      }

      // Validate leaves used doesn't exceed granted
      const { annualLeavesGranted, annualLeavesUsed } = req.data;
      if (annualLeavesUsed !== undefined && annualLeavesGranted !== undefined) {
        if (annualLeavesUsed > annualLeavesGranted) {
          return req.reject(400, `Leaves used (${annualLeavesUsed}) cannot exceed leaves granted (${annualLeavesGranted})`);
        }
        if (annualLeavesUsed < 0) {
          return req.reject(400, `Leaves used cannot be negative`);
        }
      }

      if (req.data.status === 'InPreparation') {
        req.data.status = 'Active';
      }

      const email = await generateUniqueEmail(req.data.firstName, req.data.lastName);
      if (email) req.data.email = email;
    });

    // ── Deactivate Employee ─────────────────────────────────────────
    this.on('deactivateEmployee', 'Employees', async (req) => {
      const { ID } = req.params[0] as any;
      const employee = await SELECT.one.from(Employees).where({ ID });
      if (!employee) return req.reject(404, `Employee not found`);
      if (employee.status === 'Obsolete') return req.reject(400, `Employee ${employee.employeeID} is already obsolete`);
      if (employee.status !== 'Active') return req.reject(400, `Only active employees can be marked obsolete`);

      await UPDATE(Employees).set({ status: 'Obsolete' }).where({ ID });
      req.notify(`Employee ${employee.employeeID} (${employee.firstName} ${employee.lastName}) has been marked obsolete`);
      return SELECT.one.from(Employees).where({ ID });
      });

    // ── Permanently Delete Employee ─────────────────────────────────
    this.on('permanentlyDeleteEmployee', 'Employees', async (req) => {
      const { ID } = req.params[0] as any;
      const employee = await SELECT.one.from(Employees).where({ ID });
      if (!employee) return req.reject(404, `Employee not found`);
      if (employee.status !== 'Obsolete') return req.reject(400, `Only obsolete employees can be permanently deleted`);

      await DELETE.from(Employees).where({ ID });
      req.notify(`Employee ${employee.employeeID} (${employee.firstName} ${employee.lastName}) has been permanently deleted`);
    });

    return super.init();
  }
}