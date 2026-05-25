sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"learningapp/test/integration/pages/LearningsMasterDataList",
	"learningapp/test/integration/pages/LearningsMasterDataObjectPage",
	"learningapp/test/integration/pages/LearningsObjectPage"
], function (JourneyRunner, LearningsMasterDataList, LearningsMasterDataObjectPage, LearningsObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('learningapp') + '/test/flp.html#app-preview',
        pages: {
			onTheLearningsMasterDataList: LearningsMasterDataList,
			onTheLearningsMasterDataObjectPage: LearningsMasterDataObjectPage,
			onTheLearningsObjectPage: LearningsObjectPage
        },
        async: true
    });

    return runner;
});

