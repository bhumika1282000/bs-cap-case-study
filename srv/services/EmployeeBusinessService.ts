import { EmployeeRepository } from '../repository/EmployeeRepository';
import { EmployeeValidator, ValidationResult } from '../validators/EmployeeValidator';

/**
 * Business logic service for Employee operations.
 * This layer contains testable business logic separated from CAP framework.
 */
export class EmployeeBusinessService {
  private repository: EmployeeRepository;

  constructor(repository: EmployeeRepository) {
    this.repository = repository;
  }

  /**
   * Generate the next sequential employee ID
   */
  async generateNextEmployeeID(): Promise<string> {
    const lastID = await this.repository.getLastEmployeeID();
    let nextNum = 10001;

    if (lastID) {
      const num = parseInt(lastID.replace(/^[iI]/, ''), 10);
      if (!isNaN(num)) nextNum = num + 1;
    }
    return `I${String(nextNum).padStart(5, '0')}`;
  }

  /**
   * Generate a unique email for an employee
   */
  async generateUniqueEmail(firstName: string, lastName: string): Promise<string | null> {
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
  }

  /**
   * Calculate remaining leaves
   */
  calculateRemainingLeaves(granted: number | null, used: number | null): number | null {
    const leavesGranted = granted ?? 0;
    const leavesUsed = used ?? 0;

    if (leavesUsed < 0 || leavesUsed > leavesGranted) {
      return null;
    }
    return leavesGranted - leavesUsed;
  }

  /**
   * Determine if deactivate action should be available
   */
  isDeactivatable(isActiveEntity: boolean | undefined, status: string): boolean {
    const isActive = isActiveEntity !== false;
    return isActive && status === 'Active';
  }

  /**
   * Determine if delete action should be available
   */
  isDeletable(isActiveEntity: boolean | undefined, status: string): boolean {
    const isActive = isActiveEntity !== false;
    return isActive && status === 'Obsolete';
  }

  /**
   * Validate employee data for save
   */
  validateEmployeeData(data: any): ValidationResult {
    // Required fields
    let result = EmployeeValidator.validateRequiredFields(data);
    if (!result.isValid) return result;

    // Name formats
    result = EmployeeValidator.validateName(data.firstName, 'First name');
    if (!result.isValid) return result;

    result = EmployeeValidator.validateName(data.lastName, 'Last name');
    if (!result.isValid) return result;

    // Phone
    result = EmployeeValidator.validatePhoneNumber(data.phoneNumber);
    if (!result.isValid) return result;

    // Role
    result = EmployeeValidator.validateRole(data.role);
    if (!result.isValid) return result;

    // Department
    result = EmployeeValidator.validateDepartment(data.department);
    if (!result.isValid) return result;

    // Bank details
    result = EmployeeValidator.validateBankDetails(data);
    if (!result.isValid) return result;

    result = EmployeeValidator.validateBankCode(data.bankCode);
    if (!result.isValid) return result;

    result = EmployeeValidator.validateBankName(data.bankName);
    if (!result.isValid) return result;

    result = EmployeeValidator.validateBankAccountNumber(data.bankAccountNumber);
    if (!result.isValid) return result;

    // Leaves
    result = EmployeeValidator.validateLeaves(data.annualLeavesGranted, data.annualLeavesUsed);
    if (!result.isValid) return result;

    // Ratings
    if (data.ratings?.length) {
      for (const rating of data.ratings) {
        result = EmployeeValidator.validateRating(rating);
        if (!result.isValid) return result;
      }
    }

    // Learnings
    if (data.assignedLearnings?.length) {
      for (const learning of data.assignedLearnings) {
        result = EmployeeValidator.validateLearning(learning);
        if (!result.isValid) return result;
      }
    }

    // Projects
    if (data.assignedProjects?.length) {
      for (const project of data.assignedProjects) {
        result = EmployeeValidator.validateProject(project);
        if (!result.isValid) return result;
      }
    }

    return { isValid: true };
  }

  /**
   * Check for duplicate bank account number
   */
  async checkDuplicateBankAccount(bankAccountNumber: string, excludeID: string): Promise<any> {
    return await this.repository.findByBankAccountNumber(bankAccountNumber, excludeID);
  }

  /**
   * Deactivate an employee (mark as obsolete)
   */
  async deactivateEmployee(ID: string): Promise<{ success: boolean; message: string; employee?: any }> {
    const employee = await this.repository.findById(ID);
    
    if (!employee) {
      return { success: false, message: 'Employee not found' };
    }
    if (employee.status === 'Obsolete') {
      return { success: false, message: `Employee ${employee.employeeID} is already obsolete` };
    }
    if (employee.status !== 'Active') {
      return { success: false, message: 'Only active employees can be marked obsolete' };
    }

    await this.repository.updateStatus(ID, 'Obsolete');
    return { 
      success: true, 
      message: `Employee ${employee.employeeID} (${employee.firstName} ${employee.lastName}) has been marked obsolete`,
      employee 
    };
  }

  /**
   * Permanently delete an employee
   */
  async permanentlyDeleteEmployee(ID: string): Promise<{ success: boolean; message: string; employee?: any }> {
    const employee = await this.repository.findById(ID);
    
    if (!employee) {
      return { success: false, message: 'Employee not found' };
    }
    if (employee.status !== 'Obsolete') {
      return { success: false, message: 'Only obsolete employees can be permanently deleted' };
    }

    await this.repository.deleteById(ID);
    return { 
      success: true, 
      message: `Employee ${employee.employeeID} (${employee.firstName} ${employee.lastName}) has been permanently deleted`,
      employee 
    };
  }
}

export default EmployeeBusinessService;
