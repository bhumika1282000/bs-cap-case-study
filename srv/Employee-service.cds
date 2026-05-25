using db from '../db/employee';

service EmployeeService {

    @(odata.draft.enabled)
    @restrict: [ 
    
      { grant: 'READ', to: 'authenticated-user' },
      { grant: 'WRITE', to: 'authenticated-user' },
      { grant: 'EXECUTE', to: 'authenticated-user' }
     
    ]
    entity Employees as projection on db.Employees{ * }
      actions {
        @restrict: [{ grant: 'EXECUTE', to: 'authenticated-user' }]
        @Common.IsActionCritical
        action deactivateEmployee() returns String;
        @restrict: [{ grant: 'EXECUTE', to: 'authenticated-user' }]
        @Common.IsActionCritical
        action permanentlyDeleteEmployee() returns String;
      };

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

    @readonly entity LearningsMasterData as projection on db.LearningsMasterData;
    @readonly entity ProjectsMasterData as projection on db.ProjectsMasterData;
}
