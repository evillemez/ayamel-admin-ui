'use strict';

//general settings for app behavior
var settings = {
  app: {
    apiEndpoint: 'http://ayamel.americancouncils.org/api/v1',
    notificationTimeout: 3000,
    apiKey: '2hsd834hdf'
  },
  uploadManager: {
    maxFileSize: 200000000,  //~200MB
    maxConcurrentUploads: 3
  },
  resource: {
    types: ['video', 'audio', 'image', 'document', 'data', 'collection'],
    categories: ['Food', 'Politics', 'Culture', 'Sports'],
    statuses: [
      {
        name: 'All',
        value: ''
      },
      {
        name: 'Awaiting Content',
        value: 'awaiting_content'
      },
      {
        name: 'Finished Uploading',
        value: 'finished_uploading'
      }
    ]
  },
  relation: {
    types: ['part_of', 'depends_on', 'requires', 'search_include']
  },
  file: {}
};

//base application sets up routing and registers configuration
angular.module('ayamelAdminApp', ['ui.bootstrap', 'ngResource'])
  .value('appSettings', settings.app)
  .value('resourceSettings', settings.resource)
  .value('relationSettings', settings.relation)
  .value('fileSettings', settings.file)
  .value('uploadManagerSettings', settings.uploadManager)
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'SearchCtrl'
      })
      .when('/browse', {
        templateUrl: 'views/browse.html',
        controller: 'BrowseCtrl'
      })
      .when('/create', {
        templateUrl: 'views/create.html',
        controller: 'CreateCtrl'
      })
      .when('/modify/:resourceId', {
        templateUrl: 'views/modify.html',
        controller: 'ModifyCtrl'
      })
      .when('/view/:resourceId', {
        templateUrl: 'views/view.html',
        controller: 'ViewCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function($rootScope, appSettings) {
    $rootScope.settings = {
      apiEndpoint: appSettings.apiEndpoint || false,
      apiKey: appSettings.apiKey || false
    };
  })
;

//dev app wraps main app to fake http backend for development
angular.module('ayamelAdminAppDev', ['ayamelAdminApp', 'ayamelServerFake']);
