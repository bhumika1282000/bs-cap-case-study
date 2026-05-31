import cds from '@sap/cds';
import { EmployeeRepository } from './repository/EmployeeRepository';
import { EmployeeValidator } from './validators/EmployeeValidator';

/**
 * Employee Service Handler - Refactored with Repository Pattern
 * Uses separate layers for testability:
 * - EmployeeRepository: Database operations
 * - EmployeeValidator: Validation rules
 */
export default class EmployeeServiceHandler extends cds.ApplicationService {
  private repository!: EmployeeRepository;

  async init() {
    const { Employees, LearningsMasterData } = this.entities;

    // Initialize repository
    this.repository = new EmployeeRepository();
    await this.repository.initialize();

    // ── Helper: get next sequential employee ID ──────────────────────
    const getNextEmployeeID = async () => {
      const lastID = await this.repository.getLastEmployeeID();
      let nextNum = 10001;

      if (lastID) {
        const num = parseInt(lastID.replace(/^[iI]/, ''), 10);
        if (!isNaN(num)) nextNum = num + 1;
      }
      return `I${String(nextNum).padStart(5, '0')}`;
    };

    // ── Helper: generate unique email ─────────────────────────────────
    const generateUniqueEmail = async (firstName: string, lastName: string) => {
      const f = (firstName || '').trim().toLowerCase();
      const l = (lastName || '').trim().toLowerCase();
      if (!f || !l) return null;

      const base = `${f}.${l}`;
      const existingEmails = await this.repository.findEmailsByPattern(`${base}%@sap.com`);
      const taken = new Set(existingEmails);

      let email = `${base}@sap.com`;
      let counter = 1;

      while (taken.has(email)) {
        email = `${base}${counter}@sap.com`;
        counter++;
      }
      return email;
    };

    // ── Calculate remaining leaves and action availability after read ────────────────────
    this.after('READ', 'Employees', (employees: any) => {
      if (!employees) return;

      const employeeList = Array.isArray(employees) ? employees : [employees];

      for (const employee of employeeList) {
        // Calculate remaining leaves
        const leavesGranted = employee.annualLeavesGranted ?? 0;
        const leavesUsed = employee.annualLeavesUsed ?? 0;

        if (leavesUsed < 0 || leavesUsed > leavesGranted) {
          employee.remainingLeaves = null;
        } else {
          employee.remainingLeaves = leavesGranted - leavesUsed;
        }
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
      const beginnerCourses = await this.repository.getBeginnerCourses(LearningsMasterData);
      if (beginnerCourses.length === 0) return;

      const today = new Date().toISOString().slice(0, 10);
      for (const course of beginnerCourses) {
        await this.repository.insertLearningDraft({
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

    // ── Validate and activate on Save ─────────────────────
    this.before('SAVE', 'Employees', async (req) => {
      // Validate employee data using the validator
      const validationResult = EmployeeValidator.validateEmployeeData(req.data);
      if (!validationResult.isValid) {
        return req.reject(400, validationResult.message!);
      }

      // Check for duplicate bank account
      if (req.data.bankAccountNumber) {
        const duplicate = await this.repository.findByBankAccountNumber(
          req.data.bankAccountNumber,
          req.data.ID
        );
        if (duplicate) {
          return req.reject(
            400,
            `Bank account number ${req.data.bankAccountNumber} is already assigned to employee ${duplicate.employeeID} : ${duplicate.firstName} ${duplicate.lastName}`
          );
        }
      }

      // Activate if in preparation
      if (req.data.status === 'InPreparation') {
        req.data.status = 'Active';
      }

      // Generate email
      const email = await generateUniqueEmail(req.data.firstName, req.data.lastName);
      if (email) req.data.email = email;
    });

    // ── Deactivate Employee ─────────────────────────────────────────
    this.on('deactivateEmployee', 'Employees', async (req) => {
      //extract id from req parameters
      const { ID } = req.params[0] as any;
      const employee = await this.repository.findById(ID);

      if (!employee) return req.reject(404, 'Employee not found');
      if (employee.status === 'Obsolete') return req.reject(400, `Employee ${employee.employeeID} is already obsolete`);
      if (employee.status !== 'Active') return req.reject(400, 'Only active employees can be marked obsolete');

      await this.repository.updateStatus(ID, 'Obsolete');
      req.notify(`Employee ${employee.employeeID} (${employee.firstName} ${employee.lastName}) has been marked obsolete`);
      //side effects
      return SELECT.one.from(Employees).where({ ID });
    });

    // ── Permanently Delete Employee ─────────────────────────────────
    this.on('permanentlyDeleteEmployee', 'Employees', async (req) => {
      const { ID } = req.params[0] as any;
      const employee = await this.repository.findById(ID);

      if (!employee) return req.reject(404, 'Employee not found');
      if (employee.status !== 'Obsolete') return req.reject(400, 'Only obsolete employees can be permanently deleted');

      await this.repository.deleteById(ID);
      req.notify(`Employee ${employee.employeeID} (${employee.firstName} ${employee.lastName}) has been permanently deleted`);
    });

    return super.init();
  }
}
