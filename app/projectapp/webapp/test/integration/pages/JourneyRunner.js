sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"projectapp/test/integration/pages/ProjectsMasterDataList",
	"projectapp/test/integration/pages/ProjectsMasterDataObjectPage",
	"projectapp/test/integration/pages/ProjectsObjectPage"
], function (JourneyRunner, ProjectsMasterDataList, ProjectsMasterDataObjectPage, ProjectsObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('projectapp') + '/test/flp.html#app-preview',
        pages: {
			onTheProjectsMasterDataList: ProjectsMasterDataList,
			onTheProjectsMasterDataObjectPage: ProjectsMasterDataObjectPage,
			onTheProjectsObjectPage: ProjectsObjectPage
        },
        async: true
    });

    return runner;
});

