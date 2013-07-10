'use strict';

angular.module('ayamelAdminApp')
  .controller('CreateCtrl', function ($scope, $http, appSettings, resourceSettings, $location, $routeParams, apiUrlBuilder) {
    if (!$scope.settings.apiKey) {
      $location.url('/');
    }

    $scope.resource = null;

    $scope.files = [];
    $scope.submitDisabled = true;
  });
