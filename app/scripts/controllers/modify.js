'use strict';

angular.module('ayamelAdminApp')
  .controller('ModifyCtrl', function ($scope, $http, appSettings, resourceSettings, $location, $routeParams) {
    if (!$scope.apiKey) {
      $location.url('/');
    }

    $scope.resource = null;

    //get the resource on load
    $http.get(appSettings.apiEndpoint + '/resources/' + $routeParams.resourceId).success(function(data, status, headers, config) {
      $scope.resource = data.resource;
    }).error(function (data, status, headers, config) {
      $scope.$emit('notification', { type: 'error', message: "(" + status + ") Could not get resource." });
    });


  })
 ;
