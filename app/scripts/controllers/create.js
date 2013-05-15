'use strict';

angular.module('ayamelAdminApp')
  .controller('CreateCtrl', function ($scope, $http, appSettings, resourceSettings, $location, $routeParams) {
    if (!$scope.settings.apiKey) {
      $location.url('/');
    }

    $scope.resource = null;

    $scope.files = [];
    $scope.fileSubmit = false;
    $scope.submitDisabled = true;

    $scope.tableRowClass = function (index) {
      if (index % 4 === 0) {
        return 'success';
      }

      if (index % 4 === 1) {
        return 'error';
      }

      if (index % 4 === 2) {
        return 'warning';
      }

      if (index % 4 === 3) {
        return 'info';
      }
    }

    /*$scope.fileSubmitter = function () {
      $scope
    };*/
  })
 ;
