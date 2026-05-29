using db from '../db/employee';

service ProjectService {
    
    @restrict: [
        { grant: '*', to: 'ADMIN' },
        { grant: 'READ', to: 'VIEWER' },
        { grant: 'READ', to: 'PROJECT_ADMIN' }
    ]
    @odata.draft.enabled
    entity ProjectsMasterData as projection on db.ProjectsMasterData{ * };
}    