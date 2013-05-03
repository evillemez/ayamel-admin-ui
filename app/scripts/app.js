'use strict';

//general settings for app behavior
var appSettings = {
  apiBaseUrl: 'http://ayamel.americancouncils.org/api',
  notificationTimeout: 3000
};

//base application sets up routing
angular.module('ayamelAdminApp', ['resourceSettings','ngResource'])
  .value('appSettings', appSettings)
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
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
        controller: 'MainCtrl'
      })
      .when('/view/:resourceId', {
        templateUrl: 'views/view.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function() {
    $('.tooltips').tooltip({
      placement: 'top',
      container: 'body'
    });
  })
;

//wrap and fake the http backend for development
angular.module('ayamelAdminAppDev', ['ayamelAdminApp', 'ayamelServerFake']);
