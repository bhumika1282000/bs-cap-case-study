using db from '../db/employee';

service EmployeeService {

    @(odata.draft.enabled)
    @restrict: [ 
    
      { grant: 'READ', to: 'authenticated-user' },
      { grant: 'WRITE', to: 'authenticated-user' }
     
    ]
    entity Employees as projection on db.Employees{ * };

 // ========== CHILD ENTITIES ==========
    @restrict: [
        { grant: 'READ',  to: 'authenticated-user' },
        { grant: 'WRITE', to: 'authenticated-user' }
    ]
    entity Ratings as projection on db.Ratings{ * };

    @restrict: [
        { grant: 'READ',  to: 'authenticated-user' },
        { grant: 'WRITE', to: 'authenticated-user' }
    ]
    entity Learnings as projection on db.Learnings{ * };

    @restrict: [
        { grant: 'READ',  to: 'authenticated-user' },
        { grant: 'WRITE', to: 'authenticated-user' }
    ]
    entity Projects as projection on db.Projects{ * };   

     @restrict: [
        { grant: 'EXECUTE', to: 'authenticated-user' }
    ]
    action deactivateEmployee(employeeID : UUID);

     @restrict: [
        { grant: 'EXECUTE', to: 'authenticated-user' }
    ]
    action permanentlyDeleteEmployee(employeeID : UUID);

    entity LearningsMasterData as projection on db.LearningsMasterData;
}
