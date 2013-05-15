'use strict';

angular.module('ayamelAdminApp')
  .controller('BrowseCtrl', function ($scope, $http, appSettings, resourceSettings, $location) {
    if (!$scope.settings.apiKey) {
      $location.url('/');
    }

    $scope.availableFilters = resourceSettings.types;
    $scope.availableStatuses = resourceSettings.statuses;
    $scope.filterSelected = {};
    $scope.resources = [];
    $scope.filters = [];
    $scope.currentPage = 3;
    $scope.pages = 4;

    //get the resources on load
    $http.get(appSettings.apiEndpoint + '/resources').success(function(data, status, headers, config) {
      $scope.resources = data.resources;
    }).error(function(data, status, headers, config) {
      $scope.$emit('notification', { type: 'error', message: "(" + status + ") Could not get resources." });
    });

    $scope.showPagination = function() {
      return $scope.resources.length > $scope.itemsPerPage;
    };

    $scope.getNumPages = function() {
      return Math.ceil($scope.resources.length / $scope.itemsPerPage);
    };

    $scope.setPage = function(num) {
      $scope.currentPage = num;
    };
  })
 ;
