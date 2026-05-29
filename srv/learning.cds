using db from '../db/employee';

service LearningService {

    @restrict: [
        { grant: '*', to: 'ADMIN' },
        { grant: 'READ', to: 'VIEWER' },
        { grant: 'READ', to: 'LEARNING_ADMIN' }
    ]
    @odata.draft.enabled
    entity LearningsMasterData as projection on db.LearningsMasterData{ * };
}    