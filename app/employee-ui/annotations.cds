using { EmployeeService } from '../../srv/Employee-service';

annotate EmployeeService.Employees with @UI.LineItem: [
  { Value: employeeID, Label: 'Employee ID' },
  { Value: firstName, Label: 'First Name' },
  { Value: lastName, Label: 'Last Name' },
  { Value: email, Label: 'Email' }
];

// ============================================================================
// FIELDGROUP: Personal Information
// ============================================================================
annotate EmployeeService.Employees with @UI.FieldGroup #PersonalInfo: {
  $Type: 'UI.FieldGroupType',
  Data: [
    { Value: employeeID, Label: 'Employee ID' },
    { Value: firstName, Label: 'First Name' },
    { Value: lastName, Label: 'Last Name' },
    { Value: email, Label: 'Email' },
    { Value: joiningDate, Label: 'Joining Date' },
    { Value: status, Label: 'Status' }
  ]
};

// ============================================================================
// FIELDGROUP: Contact Information
// ============================================================================
annotate EmployeeService.Employees with @UI.FieldGroup #ContactInfo: {
  $Type: 'UI.FieldGroupType',
  Data: [
    { Value: phoneNumber, Label: 'Phone Number' },
    { Value: address, Label: 'Address' }
  ]
};

// ============================================================================
// FIELDGROUP: Employment Details
// ============================================================================
annotate EmployeeService.Employees with @UI.FieldGroup #EmploymentDetails: {
  $Type: 'UI.FieldGroupType',
  Data: [
    { Value: department, Label: 'Department' },
    { Value: role, Label: 'Role' }
  ]
};

// ============================================================================
// FIELDGROUP: Bank Details
// ============================================================================
annotate EmployeeService.Employees with @UI.FieldGroup #BankDetails: {
  $Type: 'UI.FieldGroupType',
  Data: [
    { Value: bankName, Label: 'Bank Name' },
    { Value: bankAccountNumber, Label: 'Bank Account Number' },
    { Value: bankCode, Label: 'Bank Code' }
  ]
};

// ============================================================================
// FIELDGROUP: Leave Information
// ============================================================================
annotate EmployeeService.Employees with @UI.FieldGroup #LeaveInfo: {
  $Type: 'UI.FieldGroupType',
  Data: [
    { Value: annualLeavesGranted, Label: 'Annual Leaves Granted' },
    { Value: annualLeavesUsed, Label: 'Annual Leaves Used' }
  ]
};

// ============================================================================
// FACETS: Detail View Structure
// ============================================================================
annotate EmployeeService.Employees with @UI.Facets: [
  {
    $Type: 'UI.ReferenceFacet',
    Label: 'Personal Information',
    Target: '@UI.FieldGroup#PersonalInfo'
  },
  {
    $Type: 'UI.ReferenceFacet',
    Label: 'Contact Information',
    Target: '@UI.FieldGroup#ContactInfo'
  },
  {
    $Type: 'UI.ReferenceFacet',
    Label: 'Employment Details',
    Target: '@UI.FieldGroup#EmploymentDetails'
  },
  {
    $Type: 'UI.ReferenceFacet',
    Label: 'Bank Details',
    Target: '@UI.FieldGroup#BankDetails'
  },
  {
    $Type: 'UI.ReferenceFacet',
    Label: 'Leave Information',
    Target: '@UI.FieldGroup#LeaveInfo'
  },
    {
        $Type : 'UI.ReferenceFacet',
        Label : 'Assigned Learnings',
        ID : 'AssignedLearnings',
        Target : 'assignedLearnings/@UI.LineItem#AssignedLearnings',
    },
];

annotate EmployeeService.Employees with @UI.Identification: [
  { Value: employeeID, Label: 'Employee ID' },
  { Value: firstName, Label: 'First Name' },
  { Value: lastName, Label: 'Last Name' },
  { Value: email, Label: 'Email' },
  { Value: phoneNumber, Label: 'Phone Number' },
  { Value: address, Label: 'Address' },
  { Value: department, Label: 'Department' },
  { Value: role, Label: 'Role' },
  { Value: status, Label: 'Status' },
  { Value: joiningDate, Label: 'Joining Date' },
  { Value: bankName, Label: 'Bank Name' },
  { Value: bankAccountNumber, Label: 'Bank Account Number' },
  { Value: bankCode, Label: 'Bank Code' },
  { Value: annualLeavesGranted, Label: 'Annual Leaves Granted' },
  { Value: annualLeavesUsed, Label: 'Annual Leaves Used' }
];

annotate EmployeeService.Learnings with {
  learningMaster @Common.Text: learningMaster.courseDescription;

  learningMaster @Common.ValueList: {
    CollectionPath: 'LearningsMasterData',
    Label: 'Select Course',
    Parameters: [
      {
        $Type: 'Common.ValueListParameterInOut',
        LocalDataProperty: learningMaster_ID,
        ValueListProperty: 'learningID',
        ![@UI.Importance]: #High
      },
      {
        $Type: 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'courseCode',
        ![@UI.Importance]: #High
      },
      {
        $Type: 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'courseDescription'
      }
    ]
  };
};

annotate EmployeeService.Learnings with @(
    UI.LineItem #AssignedLearnings : [
        {
            $Type: 'UI.DataField',
            Value: learningMaster_ID,  // Use FK field
            Label: 'Learning Master ID',
            ![@UI.Importance]: #High
        },
        {
            $Type: 'UI.DataField',
            Value: learningMaster.courseCode,  // Display course code
            Label: 'Course Code'
        },
        {
            $Type : 'UI.DataField',
            Value : status,
            Label : 'Status',
        },
        {
            $Type : 'UI.DataField',
            Value : assignedDate,
            Label : 'Assigned Date',
        },
        {
            $Type : 'UI.DataField',
            Value : completedDate,
            Label : 'Completed Date',
        },
    ],
);