import { expect } from 'chai';
import sinon from 'sinon';
import { EmployeeValidator } from '../../srv/validators/EmployeeValidator';

describe('EmployeeValidator', () => {
  describe('validateRequiredFields', () => {
    it('should fail when firstName is missing', () => {
      const data = { lastName: 'Doe', joiningDate: '2024-01-01', phoneNumber: '1234567890', department: 'IT', role: 'Developer' };
      const result = EmployeeValidator.validateRequiredFields(data);
      expect(result.isValid).to.be.false;
      expect(result.message).to.equal('First name is required');
    });

    it('should fail when firstName is empty string', () => {
      const data = { firstName: '   ', lastName: 'Doe', joiningDate: '2024-01-01', phoneNumber: '1234567890', department: 'IT', role: 'Developer' };
      const result = EmployeeValidator.validateRequiredFields(data);
      expect(result.isValid).to.be.false;
      expect(result.message).to.equal('First name is required');
    });

    it('should fail when lastName is missing', () => {
      const data = { firstName: 'John', joiningDate: '2024-01-01', phoneNumber: '1234567890', department: 'IT', role: 'Developer' };
      const result = EmployeeValidator.validateRequiredFields(data);
      expect(result.isValid).to.be.false;
      expect(result.message).to.equal('Last name is required');
    });

    it('should fail when joiningDate is missing', () => {
      const data = { firstName: 'John', lastName: 'Doe', phoneNumber: '1234567890', department: 'IT', role: 'Developer' };
      const result = EmployeeValidator.validateRequiredFields(data);
      expect(result.isValid).to.be.false;
      expect(result.message).to.equal('Joining date is required');
    });

    it('should fail when phoneNumber is missing', () => {
      const data = { firstName: 'John', lastName: 'Doe', joiningDate: '2024-01-01', department: 'IT', role: 'Developer' };
      const result = EmployeeValidator.validateRequiredFields(data);
      expect(result.isValid).to.be.false;
      expect(result.message).to.equal('Phone number is required');
    });

    it('should fail when department is missing', () => {
      const data = { firstName: 'John', lastName: 'Doe', joiningDate: '2024-01-01', phoneNumber: '1234567890', role: 'Developer' };
      const result = EmployeeValidator.validateRequiredFields(data);
      expect(result.isValid).to.be.false;
      expect(result.message).to.equal('Department is required');
    });

    it('should fail when role is missing', () => {
      const data = { firstName: 'John', lastName: 'Doe', joiningDate: '2024-01-01', phoneNumber: '1234567890', department: 'IT' };
      const result = EmployeeValidator.validateRequiredFields(data);
      expect(result.isValid).to.be.false;
      expect(result.message).to.equal('Role is required');
    });

    it('should pass when all required fields are present', () => {
      const data = { firstName: 'John', lastName: 'Doe', joiningDate: '2024-01-01', phoneNumber: '1234567890', department: 'IT', role: 'Developer' };
      const result = EmployeeValidator.validateRequiredFields(data);
      expect(result.isValid).to.be.true;
    });
  });

  describe('validateName', () => {
    it('should pass for valid names', () => {
      expect(EmployeeValidator.validateName('John', 'First name').isValid).to.be.true;
      expect(EmployeeValidator.validateName("O'Brien", 'Last name').isValid).to.be.true;
      expect(EmployeeValidator.validateName('Mary-Jane', 'First name').isValid).to.be.true;
      expect(EmployeeValidator.validateName('Van Der Berg', 'Last name').isValid).to.be.true;
    });

    it('should fail for names with numbers', () => {
      const result = EmployeeValidator.validateName('John123', 'First name');
      expect(result.isValid).to.be.false;
      expect(result.message).to.contain('letters, spaces, hyphens, or apostrophes');
    });

    it('should fail for names with special characters', () => {
      const result = EmployeeValidator.validateName('John@Doe', 'First name');
      expect(result.isValid).to.be.false;
    });
  });

  describe('validatePhoneNumber', () => {
    it('should pass for 10 digit phone number', () => {
      const result = EmployeeValidator.validatePhoneNumber('1234567890');
      expect(result.isValid).to.be.true;
    });

    it('should fail for phone number with less than 10 digits', () => {
      const result = EmployeeValidator.validatePhoneNumber('123456789');
      expect(result.isValid).to.be.false;
      expect(result.message).to.equal('Phone number must be exactly 10 digits');
    });

    it('should fail for phone number with more than 10 digits', () => {
      const result = EmployeeValidator.validatePhoneNumber('12345678901');
      expect(result.isValid).to.be.false;
    });

    it('should fail for phone number with letters', () => {
      const result = EmployeeValidator.validatePhoneNumber('123456789a');
      expect(result.isValid).to.be.false;
    });
  });

  describe('validateRole', () => {
    it('should pass for valid roles', () => {
      expect(EmployeeValidator.validateRole('Developer').isValid).to.be.true;
      expect(EmployeeValidator.validateRole('SDE2').isValid).to.be.true;
      expect(EmployeeValidator.validateRole('Senior Developer').isValid).to.be.true;
      expect(EmployeeValidator.validateRole('Tech Lead/Manager').isValid).to.be.true;
    });

    it('should fail for roles with invalid characters', () => {
      const result = EmployeeValidator.validateRole('Developer@Senior');
      expect(result.isValid).to.be.false;
    });
  });

  describe('validateDepartment', () => {
    it('should pass for valid departments', () => {
      expect(EmployeeValidator.validateDepartment('IT').isValid).to.be.true;
      expect(EmployeeValidator.validateDepartment('R&D').isValid).to.be.true;
      expect(EmployeeValidator.validateDepartment('Human Resources').isValid).to.be.true;
      expect(EmployeeValidator.validateDepartment('Sales-Marketing').isValid).to.be.true;
    });

    it('should fail for departments with numbers', () => {
      const result = EmployeeValidator.validateDepartment('IT123');
      expect(result.isValid).to.be.false;
    });
  });

  describe('validateBankDetails', () => {
    it('should pass when no bank details provided', () => {
      const result = EmployeeValidator.validateBankDetails({});
      expect(result.isValid).to.be.true;
    });

    it('should pass when all bank details provided', () => {
      const data = { bankName: 'HDFC Bank', bankCode: 'HDFCIN01234', bankAccountNumber: '12345678901234' };
      const result = EmployeeValidator.validateBankDetails(data);
      expect(result.isValid).to.be.true;
    });

    it('should fail when only bankName provided', () => {
      const data = { bankName: 'HDFC Bank' };
      const result = EmployeeValidator.validateBankDetails(data);
      expect(result.isValid).to.be.false;
      expect(result.message).to.equal('Bank code is required when providing bank details');
    });

    it('should fail when bankCode missing', () => {
      const data = { bankName: 'HDFC Bank', bankAccountNumber: '12345678901234' };
      const result = EmployeeValidator.validateBankDetails(data);
      expect(result.isValid).to.be.false;
      expect(result.message).to.equal('Bank code is required when providing bank details');
    });

    it('should fail when bankAccountNumber missing', () => {
      const data = { bankName: 'HDFC Bank', bankCode: 'HDFCIN01234' };
      const result = EmployeeValidator.validateBankDetails(data);
      expect(result.isValid).to.be.false;
      expect(result.message).to.equal('Bank account number is required when providing bank details');
    });
  });

  describe('validateBankCode', () => {
    it('should pass for valid bank codes (8-11 alphanumeric)', () => {
      expect(EmployeeValidator.validateBankCode('HDFCIN01').isValid).to.be.true;
      expect(EmployeeValidator.validateBankCode('HDFCIN01234').isValid).to.be.true;
    });

    it('should pass when bankCode is empty', () => {
      expect(EmployeeValidator.validateBankCode('').isValid).to.be.true;
    });

    it('should fail for bank codes less than 8 characters', () => {
      const result = EmployeeValidator.validateBankCode('HDFC12');
      expect(result.isValid).to.be.false;
    });

    it('should fail for bank codes more than 11 characters', () => {
      const result = EmployeeValidator.validateBankCode('HDFCIN0123456');
      expect(result.isValid).to.be.false;
    });
  });

  describe('validateBankAccountNumber', () => {
    it('should pass for valid account numbers (8-20 digits)', () => {
      expect(EmployeeValidator.validateBankAccountNumber('12345678').isValid).to.be.true;
      expect(EmployeeValidator.validateBankAccountNumber('12345678901234567890').isValid).to.be.true;
    });

    it('should pass when accountNumber is empty', () => {
      expect(EmployeeValidator.validateBankAccountNumber('').isValid).to.be.true;
    });

    it('should fail for account numbers less than 8 digits', () => {
      const result = EmployeeValidator.validateBankAccountNumber('1234567');
      expect(result.isValid).to.be.false;
    });

    it('should fail for account numbers with letters', () => {
      const result = EmployeeValidator.validateBankAccountNumber('12345678a');
      expect(result.isValid).to.be.false;
    });
  });

  describe('validateLeaves', () => {
    it('should pass when leaves used is less than granted', () => {
      const result = EmployeeValidator.validateLeaves(20, 10);
      expect(result.isValid).to.be.true;
    });

    it('should pass when leaves used equals granted', () => {
      const result = EmployeeValidator.validateLeaves(20, 20);
      expect(result.isValid).to.be.true;
    });

    it('should fail when leaves used exceeds granted', () => {
      const result = EmployeeValidator.validateLeaves(20, 25);
      expect(result.isValid).to.be.false;
      expect(result.message).to.contain('cannot exceed');
    });

    it('should fail when leaves used is negative', () => {
      const result = EmployeeValidator.validateLeaves(20, -5);
      expect(result.isValid).to.be.false;
      expect(result.message).to.contain('cannot be negative');
    });

    it('should pass when both values are undefined', () => {
      const result = EmployeeValidator.validateLeaves(undefined, undefined);
      expect(result.isValid).to.be.true;
    });
  });

  describe('validateRating', () => {
    it('should pass for valid rating', () => {
      const rating = { year: '2024', rating: 4, reviewerID: 'REV001' };
      const result = EmployeeValidator.validateRating(rating);
      expect(result.isValid).to.be.true;
    });

    it('should fail when year is missing', () => {
      const rating = { rating: 4, reviewerID: 'REV001' };
      const result = EmployeeValidator.validateRating(rating);
      expect(result.isValid).to.be.false;
      expect(result.message).to.equal('Rating year is required');
    });

    it('should fail when rating is missing', () => {
      const rating = { year: '2024', reviewerID: 'REV001' };
      const result = EmployeeValidator.validateRating(rating);
      expect(result.isValid).to.be.false;
      expect(result.message).to.equal('Rating value is required');
    });

    it('should fail when reviewerID is missing', () => {
      const rating = { year: '2024', rating: 4 };
      const result = EmployeeValidator.validateRating(rating);
      expect(result.isValid).to.be.false;
      expect(result.message).to.equal('Reviewer ID is required');
    });

    it('should fail when rating is out of range', () => {
      const rating = { year: '2024', rating: 6, reviewerID: 'REV001' };
      const result = EmployeeValidator.validateRating(rating);
      expect(result.isValid).to.be.false;
      expect(result.message).to.contain('between 1 and 5');
    });

    it('should fail when reviewerID has special characters', () => {
      const rating = { year: '2024', rating: 4, reviewerID: 'REV@001' };
      const result = EmployeeValidator.validateRating(rating);
      expect(result.isValid).to.be.false;
      expect(result.message).to.contain('only letters and numbers');
    });

    it('should fail when year is invalid', () => {
      const rating = { year: '1999', rating: 4, reviewerID: 'REV001' };
      const result = EmployeeValidator.validateRating(rating);
      expect(result.isValid).to.be.false;
      expect(result.message).to.contain('between 2000');
    });
  });

  describe('validateLearning', () => {
    it('should pass for valid learning', () => {
      const learning = { learningMaster_ID: 'LRN001', assignedDate: '2024-01-01' };
      const result = EmployeeValidator.validateLearning(learning);
      expect(result.isValid).to.be.true;
    });

    it('should fail when learningMaster_ID is missing', () => {
      const learning = { assignedDate: '2024-01-01' };
      const result = EmployeeValidator.validateLearning(learning);
      expect(result.isValid).to.be.false;
      expect(result.message).to.equal('Learning is required');
    });

    it('should fail when assignedDate is missing', () => {
      const learning = { learningMaster_ID: 'LRN001' };
      const result = EmployeeValidator.validateLearning(learning);
      expect(result.isValid).to.be.false;
      expect(result.message).to.equal('Learning assigned date is required');
    });

    it('should fail when completedDate is before assignedDate', () => {
      const learning = { learningMaster_ID: 'LRN001', assignedDate: '2024-06-01', completedDate: '2024-01-01' };
      const result = EmployeeValidator.validateLearning(learning);
      expect(result.isValid).to.be.false;
      expect(result.message).to.contain('cannot be before');
    });

    it('should pass when completedDate is after assignedDate', () => {
      const learning = { learningMaster_ID: 'LRN001', assignedDate: '2024-01-01', completedDate: '2024-06-01' };
      const result = EmployeeValidator.validateLearning(learning);
      expect(result.isValid).to.be.true;
    });
  });

  describe('validateProject', () => {
    it('should pass for valid project', () => {
      const project = { projectMaster_ID: 'PRJ001', assignedDate: '2024-01-01' };
      const result = EmployeeValidator.validateProject(project);
      expect(result.isValid).to.be.true;
    });

    it('should fail when projectMaster_ID is missing', () => {
      const project = { assignedDate: '2024-01-01' };
      const result = EmployeeValidator.validateProject(project);
      expect(result.isValid).to.be.false;
      expect(result.message).to.equal('Project is required');
    });

    it('should fail when assignedDate is missing', () => {
      const project = { projectMaster_ID: 'PRJ001' };
      const result = EmployeeValidator.validateProject(project);
      expect(result.isValid).to.be.false;
      expect(result.message).to.equal('Project assigned date is required');
    });

    it('should fail when completedDate is before assignedDate', () => {
      const project = { projectMaster_ID: 'PRJ001', assignedDate: '2024-06-01', completedDate: '2024-01-01' };
      const result = EmployeeValidator.validateProject(project);
      expect(result.isValid).to.be.false;
      expect(result.message).to.contain('cannot be before');
    });
  });
});
