import cds from '@sap/cds';
import { EmployeeRepository } from './repository/EmployeeRepository';
import { EmployeeBusinessService } from './services/EmployeeBusinessService';

/**
 * Employee Service Handler - Refactored with Repository Pattern
 * Uses separate layers for testability:
 * - EmployeeRepository: Database operations
 * - EmployeeBusinessService: Business logic
 * - EmployeeValidator: Validation rules
 */
export default class EmployeeServiceHandler extends cds.ApplicationService {
  private repository!: EmployeeRepository;
  private businessService!: EmployeeBusinessService;

  async init() {
    const { Employees, LearningsMasterData } = this.entities;

    // Initialize repository and business service
    this.repository = new EmployeeRepository();
    await this.repository.initialize();
    this.businessService = new EmployeeBusinessService(this.repository);

    // ── Calculate remaining leaves and action availability after read ────────────────────
    this.after('READ', 'Employees', (employees: any) => {
      if (!employees) return;

      const employeeList = Array.isArray(employees) ? employees : [employees];

      for (const employee of employeeList) {
        // Calculate remaining leaves
        employee.remainingLeaves = this.businessService.calculateRemainingLeaves(
          employee.annualLeavesGranted,
          employee.annualLeavesUsed
        );

        // Action availability
        employee.isDeactivatable = this.businessService.isDeactivatable(
          employee.IsActiveEntity,
          employee.status
        );
        employee.isDeletable = this.businessService.isDeletable(
          employee.IsActiveEntity,
          employee.status
        );
      }
    });

    // ── Defaults when a new draft is created ────────────────────────
    this.before('CREATE', 'Employees.drafts', async (req) => {
      req.data.employeeID = await this.businessService.generateNextEmployeeID();
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
      // Use business service for validation
      const validationResult = this.businessService.validateEmployeeData(req.data);
      if (!validationResult.isValid) {
        return req.reject(400, validationResult.message!);
      }

      // Check for duplicate bank account
      if (req.data.bankAccountNumber) {
        const duplicate = await this.businessService.checkDuplicateBankAccount(
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
      const email = await this.businessService.generateUniqueEmail(
        req.data.firstName,
        req.data.lastName
      );
      if (email) req.data.email = email;
    });

    // ── Deactivate Employee ─────────────────────────────────────────
    this.on('deactivateEmployee', 'Employees', async (req) => {
      const { ID } = req.params[0] as any;
      const result = await this.businessService.deactivateEmployee(ID);

      if (!result.success) {
        const status = result.message === 'Employee not found' ? 404 : 400;
        return req.reject(status, result.message);
      }

      req.notify(result.message);
      return SELECT.one.from(Employees).where({ ID });
    });

    // ── Permanently Delete Employee ─────────────────────────────────
    this.on('permanentlyDeleteEmployee', 'Employees', async (req) => {
      const { ID } = req.params[0] as any;
      const result = await this.businessService.permanentlyDeleteEmployee(ID);

      if (!result.success) {
        const status = result.message === 'Employee not found' ? 404 : 400;
        return req.reject(status, result.message);
      }

      req.notify(result.message);
    });

    return super.init();
  }
}
