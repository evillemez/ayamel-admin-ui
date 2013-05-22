'use strict';

angular.module('ayamelAdminApp')
  .controller('ModifyCtrl', function ($scope, $http, appSettings, resourceSettings, $location, $routeParams) {
    if (!$scope.settings.apiKey) {
      $location.url('/');
    }

    $scope.resource = null;

    $scope.categories = resourceSettings.categories;

    //get the resource on load
    $http.get(appSettings.apiEndpoint + '/resources/' + $routeParams.resourceId).success(function(data, status, headers, config) {
      $scope.resource = data.resource;
    }).error(function (data, status, headers, config) {
      $scope.$emit('notification', { type: 'error', message: "(" + status + ") Could not get resource." });
    });

    $scope.resourceSubmit = function () {
      $http.put(appSettings.apiEndpoint + '/resources/' + $scope.resource.id, $scope.resource)
        .success(function (data, status, headers, config) {
          $location.url('/browse');
        })
        .error(function (data, status, headers, config) {
          $scope.$emit('notification', { type: 'error', message: "(" + status + ") Could not modify resource." });
        });
    };
  })
 ;
