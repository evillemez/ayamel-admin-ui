'use strict';

angular.module('ayamelAdminApp')
  .controller('BrowseCtrl', function ($scope, $http, appSettings, resourceSettings, $location) {
    if (!$scope.apiKey) {
      $location.url('/');
    }

    $scope.availableFilters = resourceSettings.types;
    $scope.resources = [];
    $scope.filters = [];

    //get the resources on load
    $http.get(appSettings.apiEndpoint + '/resources').success(function(data, status, headers, config) {
      $scope.resources = data.resources;
    }).error(function(data, status, headers, config) {
      $scope.$emit('notification', { type: 'error', message: "(" + status + ") Could not get resources." });
    });


  })
 ;
