'use strict';

//general settings for app behavior
var settings = {
  app: {
    apiEndpoint: 'http://staging.ayamel.org/api/v1',
    notificationTimeout: 3000,
    apiKey: '45678isafgd56789asfgdhf4567'
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
        name: 'Normal',
        value: 'normal'
      },
      {
        name: 'Processing',
        value: 'processing'
      }
    ]
  },
  relation: {
    types: ['part_of', 'based_on', 'requires', 'search', '']
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
  .factory('apiUrlBuilder', function(appSettings) {
    return {
      createUrl: function (route, filters) {
        var url = appSettings.apiEndpoint;
        
        var query = [];
        for (var filter in filters) {
          query.push(filters[filter] + '=' + filter);
        }
        //always append api key
        query.push('_key=' + appSettings.apiKey);
        
        var queryString = query.join('&');        
        return url + route + '?' + queryString;
      }
    };
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
