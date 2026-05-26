using db from '../db/employee';

service LearningService {

    @restrict: [
        { grant: 'READ',  to: 'authenticated-user' },
        { grant: 'WRITE', to: 'authenticated-user' }
    ]
    @odata.draft.enabled
     entity LearningsMasterData as projection on db.LearningsMasterData{ * };
}    