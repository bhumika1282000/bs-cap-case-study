import cds from '@sap/cds';

export default class EmployeeServiceHandler extends cds.ApplicationService {
  async init() {
    const { Employees, Learnings, LearningsMasterData } = this.entities;
    const db = await cds.connect.to('db');
    const { Employees: dbEmployees } = db.entities('db');

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

    // ── Defaults when a new draft is created ────────────────────────
    this.before('CREATE', 'Employees.drafts', async (req) => {
      req.data.employeeID = await getNextEmployeeID();
      req.data.status = 'Active';
      req.data.annualLeavesGranted = 20;
      req.data.annualLeavesUsed = 0;
      req.data.joiningDate = new Date().toISOString().slice(0, 10);
    });

    // ── Auto-generate fields on draft activation (Save) ─────────────
    this.before('SAVE', 'Employees', async (req) => {
      // Only run for newly created employees
      const existing = await SELECT.one.from(Employees).where({ ID: req.data.ID });
      if (existing) return;

      // Ensure defaults are set (fallback if before NEW didn't persist them)
      if (!req.data.employeeID) {
        req.data.employeeID = await getNextEmployeeID();
      }
      if (!req.data.status) req.data.status = 'Active';
      if (!req.data.annualLeavesGranted) req.data.annualLeavesGranted = 20;
      if (req.data.annualLeavesUsed == null) req.data.annualLeavesUsed = 0;
      if (!req.data.joiningDate) req.data.joiningDate = new Date().toISOString().slice(0, 10);

      // Auto-generate Email (firstname.lastname@sap.com, unique)
      const firstName = (req.data.firstName || '').trim().toLowerCase();
      const lastName = (req.data.lastName || '').trim().toLowerCase();
      const base = `${firstName}.${lastName}`;

      const matches = await SELECT.from(Employees)
        .columns('email')
        .where({ email: { like: `${base}%@sap.com` } });

      const taken = new Set(matches.map((e: any) => e.email));

      let email = `${base}@sap.com`;
      let counter = 1;
      while (taken.has(email)) {
        email = `${base}${counter}@sap.com`;
        counter++;
      }
      req.data.email = email;
    });

    // ── Auto-assign initial (Beginner) learnings after creation ──────
    this.after('SAVE', 'Employees', async (data, req) => {
      const existingLearnings = await SELECT.from(Learnings)
        .where({ employee_ID: data.ID });
      if (existingLearnings.length > 0) return;

      const beginnerCourses = await SELECT.from(LearningsMasterData)
        .where({ initialLevel: 'Beginner', isActive: true });
      if (beginnerCourses.length === 0) return;

      const today = new Date().toISOString().slice(0, 10);
      const entries = beginnerCourses.map((course: any) => ({
        employee_ID: data.ID,
        learningMaster_ID: course.ID,
        status: 'Assigned',
        assignedDate: today,
      }));

      await INSERT.into(Learnings).entries(entries);
    });

    return super.init();
  }
}