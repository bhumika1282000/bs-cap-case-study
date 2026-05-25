using db from '../db/employee';

service ProjectService {
    
    @restrict: [
        { grant: 'READ',  to: 'authenticated-user' },
        { grant: 'WRITE', to: 'authenticated-user' }
    ]
    @odata.draft.enabled
     entity ProjectsMasterData as projection on db.ProjectsMasterData{ * };
}    