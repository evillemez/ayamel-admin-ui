'use strict';

angular.module('ayamelAdminApp')
  .controller('ModifyCtrl', function ($scope, $http, appSettings, resourceSettings, $location, $routeParams, apiUrlBuilder) {
    if (!$scope.settings.apiKey) {
      $location.url('/');
    }

    $scope.resource = null;

    $scope.categories = resourceSettings.categories;
    $scope.resourceTypes = resourceSettings.types;

    //get the resource on load
    $http.get(apiUrlBuilder.createUrl('/resources/'+ $routeParams.resourceId)).success(function(data, status, headers, config) {
      $scope.resource = data.resource;
    }).error(function (data, status, headers, config) {
      $scope.$emit('notification', { type: 'error', message: "(" + status + ") Could not get resource." });
    });

    $scope.resourceSubmit = function () {
      $http.put(apiUrlBuilder.createUrl('/resources/' + $scope.resource.id), $scope.resource)
        .success(function (data, status, headers, config) {
          $location.url('/browse');
        })
        .error(function (data, status, headers, config) {
          $scope.$emit('notification', { type: 'error', message: "(" + status + ") Could not modify resource." });
        });
    };
  })
 ;
