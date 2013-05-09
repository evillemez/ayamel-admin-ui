'use strict';

//general settings for app behavior
var settings = {
  app: {
    apiEndpoint: 'http://ayamel.americancouncils.org/index_dev.php/api/v1/',
    notificationTimeout: 3000,
    apiKey: '2hsd834hdf'
  },
  resource: {
    types: ['video', 'audio', 'image', 'document', 'data', 'collection'],
    categories: ['Politics', 'Culture', 'Sports']
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
        controller: 'MainCtrl'
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
    $rootScope.apiEndpoint = appSettings.apiEndpoint;
    $rootScope.apiKey = appSettings.apiKey;
  })
;

//dev app wraps main app to fake http backend for development
angular.module('ayamelAdminAppDev', ['ayamelAdminApp', 'ayamelServerFake']);
