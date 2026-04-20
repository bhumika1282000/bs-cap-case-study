using db from '../db/employee';

service ProjectService {
    
    @restrict: [
        { grant: 'READ',  to: 'authenticated-user' },
        { grant: 'WRITE', to: 'authenticated-user' }
    ]
     entity ProjectsMasterData as projection on db.ProjectsMasterData{ * };
}    