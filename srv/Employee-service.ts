import cds from '@sap/cds';

// exports - named exports and default exports
// export { someFunction, someVariable, someBullShit, ..... }; // named export // import { someFunction, someVariable } from './module';
// export default someFunction; // default export // import someFunction from './module';
export default class EmployeeServiceHandler extends cds.ApplicationService {
  async init() {
    const { Employees, LearningsMasterData } = this.entities;
    const db = await cds.connect.to('db');

    // {employeeId: 'I101' }
    const { Employees: dbEmployees } = db.entities('db');
    // ── Helper: get next sequential employee ID ──────────────────────
    async function getNextEmployeeID() {
      const last = await db.run(
        SELECT.one.from(dbEmployees).columns('employeeID').orderBy('employeeID desc')
      );
      let nextNum = 10001;

      // optional chaining 
      // last => undefined => undefined.employeeID => error
      // undefined.something => error; undefined?.something => false

      // parseInt => parse the string and return an integer
      // regex = regular expression => /^[iI]/ => match 'I' or 'i' at the start of the string
      if (last?.employeeID) {
        const num = parseInt(last.employeeID.replace(/^[iI]/, ''), 10);
        if (!isNaN(num)) nextNum = num + 1;
      }
      // nextNum = 101
      // `` => template literal => string interpolation
      return `I${String(nextNum).padStart(5, '0')}`;
    }

    // function : declaration, definition and invocation
    // : type anotation
    // ── Helper: generate unique email ─────────────────────────────────

    // '    Bhumika    ' => 'Bhumika' ==> bhumika
    // short circuiting
    // '' || 'default' => 'bhumika'

    // null ''
    // number string undefined null boolean
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

      // set; contains unique values
      // set ([1, 1 , 2 , 3, 4, 4, 5]) => {1, 2, 3, 4, 5}

        // forEach, map, filter
        // map => transform each element of the array and return a new array
        // [1, 2, 3].map((x, index) => { if (index == 0) { return x * 2} else return x }) => [2, 2, 3]  
        
        // anonymous
        // any

        /**
         * 
         * function someFunction(abc) {
         *   // do something
         * }
         * 
         * const someFunction = (abc) => {
         *   // do something
         * }
         * 
         * matches.map(function(e) {
         *  return e.email;
         * })
         * 
         * record 1 => { email: 'bhumi.sap.com' }
         * record 2 => { email: 'bhumi2.sap.com' }
         * [{ email: 'bhumi.sap.com' }, { email: 'bhumi2.sap.com' }]
         * map => ['bhumi.sap.com', 'bhumi2.sap.com']
         * taken = Set('bhumi.sharma@sap.com', 'bhumi.sharma1@sap.com', 'bhumi.sharma2@sap.com')
         */
      const taken = new Set(matches.map((e: any) => e.email));
      let email = `${base}@sap.com`;
      let counter = 1;
      
      while (taken.has(email)) { // bhumi.sharma2@sap.com
        email = `${base}${counter}@sap.com`; // bhumi.sharma3@sap.com
        counter++;
      }
      return email;
    }

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
          .where({ initialLevel: 'Beginner', isActive: true });
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
      const nameRegex = /^[a-zA-Z\s'-]+$/;
      if (req.data.firstName && !nameRegex.test(req.data.firstName)) {
        req.reject(400, 'First name must contain only letters, spaces, hyphens, or apostrophes');
      }
      if (req.data.lastName && !nameRegex.test(req.data.lastName)) {
        req.reject(400, 'Last name must contain only letters, spaces, hyphens, or apostrophes');
      }

      if (req.data.bankAccountNumber) {
        const duplicate = await SELECT.one.from(Employees)
          .columns('employeeID', 'firstName', 'lastName')
          .where({ bankAccountNumber: req.data.bankAccountNumber, ID: { '!=': req.data.ID } });
        if (duplicate) {
          req.reject(400, `Bank account number ${req.data.bankAccountNumber} is already assigned to employee ${duplicate.employeeID} : ${duplicate.firstName} ${duplicate.lastName}`);
        }
      }

      if (req.data.status === 'InPreparation') {
        req.data.status = 'Active';
      }

      const email = await generateUniqueEmail(req.data.firstName, req.data.lastName);
      if (email) req.data.email = email;
    });

    return super.init();
  }
}