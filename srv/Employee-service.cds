using db from '../db/employee';

service EmployeeService {

    @(odata.draft.enabled)
    @restrict: [ 
      { grant: '*', to: 'ADMIN' },
      { grant: 'READ', to: 'VIEWER' }
    ]
    entity Employees as projection on db.Employees {
      *,
      virtual remainingLeaves : Integer,
      virtual isDeactivatable : Boolean,
      virtual isDeletable : Boolean
    }
      actions {
        @restrict: [{ grant: 'EXECUTE', to: 'ADMIN' }]
        @Common.IsActionCritical
        @Common.SideEffects: {
            TargetEntities: ['in/']
        }
        @Core.OperationAvailable: isDeactivatable
        action deactivateEmployee() returns Employees;
        @restrict: [{ grant: 'EXECUTE', to: 'ADMIN' }]
        @Common.IsActionCritical
        @Core.OperationAvailable: isDeletable
        action permanentlyDeleteEmployee();
      };

 // ========== CHILD ENTITIES ==========
    @restrict: [
        { grant: '*', to: 'ADMIN' },
        { grant: 'READ', to: 'VIEWER' }
    ]
    entity Ratings as projection on db.Ratings{ * };

    @restrict: [
        { grant: '*', to: 'ADMIN' },
        { grant: 'READ', to: 'VIEWER' },
        { grant: 'READ', to: 'LEARNING_ADMIN' }
    ]
    entity Learnings as projection on db.Learnings{ * };

    @restrict: [
        { grant: '*', to: 'ADMIN' },
        { grant: 'READ', to: 'VIEWER' },
        { grant: 'READ', to: 'PROJECT_ADMIN' }
    ]
    entity Projects as projection on db.Projects{ * };   

    @readonly entity LearningsMasterData as projection on db.LearningsMasterData;
    @readonly entity ProjectsMasterData as projection on db.ProjectsMasterData;
}
