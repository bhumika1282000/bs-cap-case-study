using { EmployeeService } from '../../srv/Employee-service';

annotate EmployeeService.Employees with @UI.LineItem: [
  { Value: employeeID },
  { Value: firstName },
  { Value: lastName },
  { Value: email }
];

annotate EmployeeService.Employees with @UI.Identification: [
  { Value: employeeID },
  { Value: firstName },
  { Value: lastName },
  { Value: email },
  { Value: phoneNumber },
  { Value: address },
  { Value: department },
  { Value: role },
  { Value: status },
  { Value: joiningDate }
];

annotate EmployeeService.Employees with @UI.Facets: [
  {
    $Type: 'UI.ReferenceFacet',
    Label: 'General Information',
    Target: '@UI.Identification'
  }
];