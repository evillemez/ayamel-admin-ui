'use strict';

angular.module('ayamelAdminApp')
  .controller('ViewCtrl', function ($scope, $http, appSettings, resourceSettings, $location, $routeParams, apiUrlBuilder) {
    if (!$scope.settings.apiKey) {
      $location.url('/');
    }

    $scope.resource = null;

    //get the resource on load
    $http.get(apiUrlBuilder.createUrl('/resources/'+ $routeParams.resourceId)).success(function(data, status, headers, config) {
      $scope.resource = data.resource;
    }).error(function (data, status, headers, config) {
      var msg = "(" + status + ") " + data.response.message || "(" + status + ") Could not get resource.";
      $scope.$emit('notification', { type: 'error', message:  msg });
    });

  })
;
