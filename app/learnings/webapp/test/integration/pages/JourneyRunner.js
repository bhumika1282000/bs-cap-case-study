sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"learnings/test/integration/pages/LearningsMasterDataList",
	"learnings/test/integration/pages/LearningsMasterDataObjectPage"
], function (JourneyRunner, LearningsMasterDataList, LearningsMasterDataObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('learnings') + '/test/flp.html#app-preview',
        pages: {
			onTheLearningsMasterDataList: LearningsMasterDataList,
			onTheLearningsMasterDataObjectPage: LearningsMasterDataObjectPage
        },
        async: true
    });

    return runner;
});

