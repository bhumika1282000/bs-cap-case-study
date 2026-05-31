/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

/**
 * Employee data validation functions.
 * These are pure functions that can be easily unit tested.
 */
export class EmployeeValidator {
  private static readonly NAME_REGEX = /^[a-zA-Z\s'-]+$/;
  private static readonly PHONE_REGEX = /^\d{10}$/;
  private static readonly ROLE_REGEX = /^[a-zA-Z0-9\s\-\/]+$/;
  private static readonly DEPARTMENT_REGEX = /^[a-zA-Z\s&\-]+$/;
  private static readonly BANK_CODE_REGEX = /^[A-Z0-9]{8,11}$/i;
  private static readonly BANK_NAME_REGEX = /^[a-zA-Z\s&.]+$/;
  private static readonly BANK_ACCOUNT_REGEX = /^\d{8,20}$/;
  private static readonly REVIEWER_ID_REGEX = /^[a-zA-Z0-9]+$/;
  private static readonly YEAR_REGEX = /^\d{4}$/;

  /**
   * Validate required fields
   */
  static validateRequiredFields(data: any): ValidationResult {
    if (!data.firstName?.trim()) {
      return { isValid: false, message: 'First name is required' };
    }
    if (!data.lastName?.trim()) {
      return { isValid: false, message: 'Last name is required' };
    }
    if (!data.joiningDate) {
      return { isValid: false, message: 'Joining date is required' };
    }
    if (!data.phoneNumber?.trim()) {
      return { isValid: false, message: 'Phone number is required' };
    }
    if (!data.department?.trim()) {
      return { isValid: false, message: 'Department is required' };
    }
    if (!data.role?.trim()) {
      return { isValid: false, message: 'Role is required' };
    }
    return { isValid: true };
  }

  /**
   * Validate name format
   */
  static validateName(name: string, fieldName: string): ValidationResult {
    if (!this.NAME_REGEX.test(name)) {
      return { 
        isValid: false, 
        message: `${fieldName} must contain only letters, spaces, hyphens, or apostrophes` 
      };
    }
    return { isValid: true };
  }

  /**
   * Validate phone number format
   */
  static validatePhoneNumber(phone: string): ValidationResult {
    if (!this.PHONE_REGEX.test(phone)) {
      return { isValid: false, message: 'Phone number must be exactly 10 digits' };
    }
    return { isValid: true };
  }

  /**
   * Validate role format
   */
  static validateRole(role: string): ValidationResult {
    if (!this.ROLE_REGEX.test(role)) {
      return { 
        isValid: false, 
        message: 'Role must contain only letters, numbers, spaces, hyphens, or /' 
      };
    }
    return { isValid: true };
  }

  /**
   * Validate department format
   */
  static validateDepartment(department: string): ValidationResult {
    if (!this.DEPARTMENT_REGEX.test(department)) {
      return { 
        isValid: false, 
        message: 'Department must contain only letters, spaces, & or hyphens' 
      };
    }
    return { isValid: true };
  }

  /**
   * Validate bank details (all or none required)
   */
  static validateBankDetails(data: any): ValidationResult {
    const hasBankName = !!data.bankName?.trim();
    const hasBankCode = !!data.bankCode?.trim();
    const hasBankAccount = !!data.bankAccountNumber?.trim();

    if (hasBankName || hasBankCode || hasBankAccount) {
      if (!hasBankName) {
        return { isValid: false, message: 'Bank name is required when providing bank details' };
      }
      if (!hasBankCode) {
        return { isValid: false, message: 'Bank code is required when providing bank details' };
      }
      if (!hasBankAccount) {
        return { isValid: false, message: 'Bank account number is required when providing bank details' };
      }
    }
    return { isValid: true };
  }

  /**
   * Validate bank code format
   */
  static validateBankCode(bankCode: string): ValidationResult {
    if (bankCode && !this.BANK_CODE_REGEX.test(bankCode)) {
      return { isValid: false, message: 'Bank code must be 8-11 alphanumeric characters' };
    }
    return { isValid: true };
  }

  /**
   * Validate bank name format
   */
  static validateBankName(bankName: string): ValidationResult {
    if (bankName && !this.BANK_NAME_REGEX.test(bankName)) {
      return { isValid: false, message: 'Bank name must contain only letters, spaces, & or .' };
    }
    return { isValid: true };
  }

  /**
   * Validate bank account number format
   */
  static validateBankAccountNumber(accountNumber: string): ValidationResult {
    if (accountNumber && !this.BANK_ACCOUNT_REGEX.test(accountNumber)) {
      return { isValid: false, message: 'Bank account number must be 8-20 digits' };
    }
    return { isValid: true };
  }

  /**
   * Validate leaves
   */
  static validateLeaves(granted: number | undefined, used: number | undefined): ValidationResult {
    if (used !== undefined && granted !== undefined) {
      if (used > granted) {
        return { 
          isValid: false, 
          message: `Leaves used (${used}) cannot exceed leaves granted (${granted})` 
        };
      }
      if (used < 0) {
        return { isValid: false, message: 'Leaves used cannot be negative' };
      }
    }
    return { isValid: true };
  }

  /**
   * Validate rating entry
   */
  static validateRating(rating: any): ValidationResult {
    if (!rating.year?.trim()) {
      return { isValid: false, message: 'Rating year is required' };
    }
    if (rating.rating === undefined || rating.rating === null) {
      return { isValid: false, message: 'Rating value is required' };
    }
    if (!rating.reviewerID?.trim()) {
      return { isValid: false, message: 'Reviewer ID is required' };
    }
    if (!this.REVIEWER_ID_REGEX.test(rating.reviewerID)) {
      return { isValid: false, message: 'Reviewer ID must contain only letters and numbers' };
    }
    if (rating.rating < 1 || rating.rating > 5) {
      return { isValid: false, message: `Rating must be between 1 and 5. Got: ${rating.rating}` };
    }
    const currentYear = new Date().getFullYear();
    if (!this.YEAR_REGEX.test(rating.year) || parseInt(rating.year) < 2000 || parseInt(rating.year) > currentYear) {
      return { isValid: false, message: `Year must be between 2000 and ${currentYear}. Got: ${rating.year}` };
    }
    return { isValid: true };
  }

  /**
   * Validate learning entry
   */
  static validateLearning(learning: any): ValidationResult {
    if (!learning.learningMaster_ID) {
      return { isValid: false, message: 'Learning is required' };
    }
    if (!learning.assignedDate) {
      return { isValid: false, message: 'Learning assigned date is required' };
    }
    if (learning.completedDate && learning.completedDate < learning.assignedDate) {
      return { isValid: false, message: 'Learning completed date cannot be before assigned date' };
    }
    return { isValid: true };
  }

  /**
   * Validate project entry
   */
  static validateProject(project: any): ValidationResult {
    if (!project.projectMaster_ID) {
      return { isValid: false, message: 'Project is required' };
    }
    if (!project.assignedDate) {
      return { isValid: false, message: 'Project assigned date is required' };
    }
    if (project.completedDate && project.completedDate < project.assignedDate) {
      return { isValid: false, message: 'Project completed date cannot be before assigned date' };
    }
    return { isValid: true };
  }

  /**
   * Validate all employee data for save
   */
  static validateEmployeeData(data: any): ValidationResult {
    // Required fields
    let result = this.validateRequiredFields(data);
    if (!result.isValid) return result;

    // Name formats
    result = this.validateName(data.firstName, 'First name');
    if (!result.isValid) return result;

    result = this.validateName(data.lastName, 'Last name');
    if (!result.isValid) return result;

    // Phone
    result = this.validatePhoneNumber(data.phoneNumber);
    if (!result.isValid) return result;

    // Role
    result = this.validateRole(data.role);
    if (!result.isValid) return result;

    // Department
    result = this.validateDepartment(data.department);
    if (!result.isValid) return result;

    // Bank details
    result = this.validateBankDetails(data);
    if (!result.isValid) return result;

    result = this.validateBankCode(data.bankCode);
    if (!result.isValid) return result;

    result = this.validateBankName(data.bankName);
    if (!result.isValid) return result;

    result = this.validateBankAccountNumber(data.bankAccountNumber);
    if (!result.isValid) return result;

    // Leaves
    result = this.validateLeaves(data.annualLeavesGranted, data.annualLeavesUsed);
    if (!result.isValid) return result;

    // Ratings
    if (data.ratings?.length) {
      for (const rating of data.ratings) {
        result = this.validateRating(rating);
        if (!result.isValid) return result;
      }
    }

    // Learnings
    if (data.assignedLearnings?.length) {
      for (const learning of data.assignedLearnings) {
        result = this.validateLearning(learning);
        if (!result.isValid) return result;
      }
    }

    // Projects
    if (data.assignedProjects?.length) {
      for (const project of data.assignedProjects) {
        result = this.validateProject(project);
        if (!result.isValid) return result;
      }
    }

    return { isValid: true };
  }
}
