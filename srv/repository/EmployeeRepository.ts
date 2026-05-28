import cds from '@sap/cds';

/**
 * Repository layer for Employee-related database operations.
 * This abstraction allows unit tests to mock database operations
 * without directly mocking CAP framework functions.
 */
export class EmployeeRepository {
  private db: any;
  private dbEmployees: any;

  constructor(db?: any) {
    this.db = db;
  }

  async initialize(): Promise<void> {
    if (!this.db) {
      this.db = await cds.connect.to('db');
    }
    this.dbEmployees = cds.entities('db').Employees;
  }

  /**
   * Get the last employee ID ordered descending
   */
  async getLastEmployeeID(): Promise<string | null> {
    const last = await this.db.run(
      SELECT.one.from(this.dbEmployees).columns('employeeID').orderBy('employeeID desc')
    );
    return last?.employeeID || null;
  }

  /**
   * Find emails matching a pattern
   */
  async findEmailsByPattern(pattern: string): Promise<string[]> {
    const matches = await this.db.run(
      SELECT.from(this.dbEmployees)
        .columns('email')
        .where({ email: { like: pattern } })
    );
    return matches.map((e: any) => e.email);
  }

  /**
   * Find employee by ID
   */
  async findById(ID: string): Promise<any> {
    return await this.db.run(
      SELECT.one.from(this.dbEmployees).where({ ID })
    );
  }

  /**
   * Find employee by bank account number (excluding a specific ID)
   */
  async findByBankAccountNumber(bankAccountNumber: string, excludeID: string): Promise<any> {
    return await this.db.run(
      SELECT.one.from(this.dbEmployees)
        .columns('employeeID', 'firstName', 'lastName')
        .where({ bankAccountNumber, ID: { '!=': excludeID } })
    );
  }

  /**
   * Update employee status
   */
  async updateStatus(ID: string, status: string): Promise<void> {
    await this.db.run(
      UPDATE(this.dbEmployees).set({ status }).where({ ID })
    );
  }

  /**
   * Delete employee by ID
   */
  async deleteById(ID: string): Promise<void> {
    await this.db.run(
      DELETE.from(this.dbEmployees).where({ ID })
    );
  }

  /**
   * Get beginner courses (initialLevel = true)
   */
  async getBeginnerCourses(LearningsMasterData: any): Promise<any[]> {
    return await this.db.run(
      SELECT.from(LearningsMasterData).where({ initialLevel: true })
    );
  }

  /**
   * Insert learning draft
   */
  async insertLearningDraft(entry: any): Promise<void> {
    await this.db.run(
      INSERT.into('EmployeeService.Learnings.drafts').entries(entry)
    );
  }
}

export default EmployeeRepository;
