import { expect } from 'chai';
import sinon, { SinonStubbedInstance } from 'sinon';
import { EmployeeBusinessService } from '../../srv/services/EmployeeBusinessService';
import { EmployeeRepository } from '../../srv/repository/EmployeeRepository';

describe('EmployeeBusinessService', () => {
  let service: EmployeeBusinessService;
  let mockRepository: SinonStubbedInstance<EmployeeRepository>;

  beforeEach(() => {
    // Create a stub for the repository
    mockRepository = sinon.createStubInstance(EmployeeRepository);
    service = new EmployeeBusinessService(mockRepository as unknown as EmployeeRepository);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('generateNextEmployeeID', () => {
    it('should return I10001 when no employees exist', async () => {
      mockRepository.getLastEmployeeID.resolves(null);
      const result = await service.generateNextEmployeeID();
      expect(result).to.equal('I10001');
    });

    it('should increment the last employee ID', async () => {
      mockRepository.getLastEmployeeID.resolves('I10005');
      const result = await service.generateNextEmployeeID();
      expect(result).to.equal('I10006');
    });

    it('should handle lowercase i prefix', async () => {
      mockRepository.getLastEmployeeID.resolves('i10010');
      const result = await service.generateNextEmployeeID();
      expect(result).to.equal('I10011');
    });

    it('should pad the number with zeros', async () => {
      mockRepository.getLastEmployeeID.resolves('I00099');
      const result = await service.generateNextEmployeeID();
      expect(result).to.equal('I00100');
    });
  });

  describe('generateUniqueEmail', () => {
    it('should generate email from first and last name', async () => {
      mockRepository.findEmailsByPattern.resolves([]);
      const result = await service.generateUniqueEmail('John', 'Doe');
      expect(result).to.equal('john.doe@sap.com');
    });

    it('should return null if firstName is empty', async () => {
      const result = await service.generateUniqueEmail('', 'Doe');
      expect(result).to.be.null;
    });

    it('should return null if lastName is empty', async () => {
      const result = await service.generateUniqueEmail('John', '');
      expect(result).to.be.null;
    });

    it('should trim whitespace from names', async () => {
      mockRepository.findEmailsByPattern.resolves([]);
      const result = await service.generateUniqueEmail('  John  ', '  Doe  ');
      expect(result).to.equal('john.doe@sap.com');
    });

    it('should convert names to lowercase', async () => {
      mockRepository.findEmailsByPattern.resolves([]);
      const result = await service.generateUniqueEmail('JOHN', 'DOE');
      expect(result).to.equal('john.doe@sap.com');
    });

    it('should add counter when email already exists', async () => {
      mockRepository.findEmailsByPattern.resolves(['john.doe@sap.com']);
      const result = await service.generateUniqueEmail('John', 'Doe');
      expect(result).to.equal('john.doe1@sap.com');
    });

    it('should increment counter until unique email found', async () => {
      mockRepository.findEmailsByPattern.resolves([
        'john.doe@sap.com',
        'john.doe1@sap.com',
        'john.doe2@sap.com'
      ]);
      const result = await service.generateUniqueEmail('John', 'Doe');
      expect(result).to.equal('john.doe3@sap.com');
    });
  });

  describe('calculateRemainingLeaves', () => {
    it('should calculate remaining leaves correctly', () => {
      const result = service.calculateRemainingLeaves(20, 5);
      expect(result).to.equal(15);
    });

    it('should return 0 when all leaves used', () => {
      const result = service.calculateRemainingLeaves(20, 20);
      expect(result).to.equal(0);
    });

    it('should return null when used exceeds granted', () => {
      const result = service.calculateRemainingLeaves(20, 25);
      expect(result).to.be.null;
    });

    it('should return null when used is negative', () => {
      const result = service.calculateRemainingLeaves(20, -5);
      expect(result).to.be.null;
    });

    it('should handle null values', () => {
      const result = service.calculateRemainingLeaves(null, null);
      expect(result).to.equal(0);
    });

    it('should treat null as 0', () => {
      const result = service.calculateRemainingLeaves(20, null);
      expect(result).to.equal(20);
    });
  });

  describe('isDeactivatable', () => {
    it('should return true for active entity with Active status', () => {
      expect(service.isDeactivatable(true, 'Active')).to.be.true;
    });

    it('should return false for active entity with Obsolete status', () => {
      expect(service.isDeactivatable(true, 'Obsolete')).to.be.false;
    });

    it('should return false for draft entity with Active status', () => {
      expect(service.isDeactivatable(false, 'Active')).to.be.false;
    });

    it('should return true when IsActiveEntity is undefined (treated as active)', () => {
      expect(service.isDeactivatable(undefined, 'Active')).to.be.true;
    });

    it('should return false for InPreparation status', () => {
      expect(service.isDeactivatable(true, 'InPreparation')).to.be.false;
    });
  });

  describe('isDeletable', () => {
    it('should return true for active entity with Obsolete status', () => {
      expect(service.isDeletable(true, 'Obsolete')).to.be.true;
    });

    it('should return false for active entity with Active status', () => {
      expect(service.isDeletable(true, 'Active')).to.be.false;
    });

    it('should return false for draft entity with Obsolete status', () => {
      expect(service.isDeletable(false, 'Obsolete')).to.be.false;
    });

    it('should return true when IsActiveEntity is undefined and status is Obsolete', () => {
      expect(service.isDeletable(undefined, 'Obsolete')).to.be.true;
    });
  });

  describe('validateEmployeeData', () => {
    const validData = {
      firstName: 'John',
      lastName: 'Doe',
      joiningDate: '2024-01-01',
      phoneNumber: '1234567890',
      department: 'IT',
      role: 'Developer'
    };

    it('should pass for valid employee data', () => {
      const result = service.validateEmployeeData(validData);
      expect(result.isValid).to.be.true;
    });

    it('should fail for invalid first name', () => {
      const data = { ...validData, firstName: 'John123' };
      const result = service.validateEmployeeData(data);
      expect(result.isValid).to.be.false;
    });

    it('should fail for invalid phone number', () => {
      const data = { ...validData, phoneNumber: '123' };
      const result = service.validateEmployeeData(data);
      expect(result.isValid).to.be.false;
    });

    it('should validate ratings when present', () => {
      const data = {
        ...validData,
        ratings: [{ year: '2024', rating: 4, reviewerID: 'REV001' }]
      };
      const result = service.validateEmployeeData(data);
      expect(result.isValid).to.be.true;
    });

    it('should fail for invalid rating', () => {
      const data = {
        ...validData,
        ratings: [{ year: '2024', rating: 6, reviewerID: 'REV001' }]
      };
      const result = service.validateEmployeeData(data);
      expect(result.isValid).to.be.false;
    });
  });

  describe('deactivateEmployee', () => {
    it('should return error when employee not found', async () => {
      mockRepository.findById.resolves(null);
      const result = await service.deactivateEmployee('123');
      expect(result.success).to.be.false;
      expect(result.message).to.equal('Employee not found');
    });

    it('should return error when employee is already obsolete', async () => {
      mockRepository.findById.resolves({ employeeID: 'I10001', status: 'Obsolete', firstName: 'John', lastName: 'Doe' });
      const result = await service.deactivateEmployee('123');
      expect(result.success).to.be.false;
      expect(result.message).to.contain('already obsolete');
    });

    it('should return error when employee is not active', async () => {
      mockRepository.findById.resolves({ employeeID: 'I10001', status: 'InPreparation', firstName: 'John', lastName: 'Doe' });
      const result = await service.deactivateEmployee('123');
      expect(result.success).to.be.false;
      expect(result.message).to.contain('Only active employees');
    });

    it('should deactivate active employee successfully', async () => {
      mockRepository.findById.resolves({ employeeID: 'I10001', status: 'Active', firstName: 'John', lastName: 'Doe' });
      mockRepository.updateStatus.resolves();
      const result = await service.deactivateEmployee('123');
      expect(result.success).to.be.true;
      expect(result.message).to.contain('marked obsolete');
      expect(mockRepository.updateStatus.calledWith('123', 'Obsolete')).to.be.true;
    });
  });

  describe('permanentlyDeleteEmployee', () => {
    it('should return error when employee not found', async () => {
      mockRepository.findById.resolves(null);
      const result = await service.permanentlyDeleteEmployee('123');
      expect(result.success).to.be.false;
      expect(result.message).to.equal('Employee not found');
    });

    it('should return error when employee is not obsolete', async () => {
      mockRepository.findById.resolves({ employeeID: 'I10001', status: 'Active', firstName: 'John', lastName: 'Doe' });
      const result = await service.permanentlyDeleteEmployee('123');
      expect(result.success).to.be.false;
      expect(result.message).to.contain('Only obsolete employees');
    });

    it('should delete obsolete employee successfully', async () => {
      mockRepository.findById.resolves({ employeeID: 'I10001', status: 'Obsolete', firstName: 'John', lastName: 'Doe' });
      mockRepository.deleteById.resolves();
      const result = await service.permanentlyDeleteEmployee('123');
      expect(result.success).to.be.true;
      expect(result.message).to.contain('permanently deleted');
      expect(mockRepository.deleteById.calledWith('123')).to.be.true;
    });
  });

  describe('checkDuplicateBankAccount', () => {
    it('should call repository with correct parameters', async () => {
      mockRepository.findByBankAccountNumber.resolves(null);
      await service.checkDuplicateBankAccount('12345678901234', 'exclude-id');
      expect(mockRepository.findByBankAccountNumber.calledWith('12345678901234', 'exclude-id')).to.be.true;
    });

    it('should return duplicate employee if found', async () => {
      const duplicate = { employeeID: 'I10001', firstName: 'Jane', lastName: 'Doe' };
      mockRepository.findByBankAccountNumber.resolves(duplicate);
      const result = await service.checkDuplicateBankAccount('12345678901234', 'exclude-id');
      expect(result).to.deep.equal(duplicate);
    });

    it('should return null if no duplicate found', async () => {
      mockRepository.findByBankAccountNumber.resolves(null);
      const result = await service.checkDuplicateBankAccount('12345678901234', 'exclude-id');
      expect(result).to.be.null;
    });
  });
});
