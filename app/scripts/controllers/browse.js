'use strict';

angular.module('ayamelAdminApp')
  .controller('BrowseCtrl', function ($scope, $http, appSettings, resourceSettings, $location, apiUrlBuilder) {
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

    $scope.modalOpen = false;

    //get the resources on load
    $scope.requestResources = function () {
      $http.get(apiUrlBuilder.createUrl('/resources')).success(function (data, status, headers, config) {
        $scope.resources = data.resources;
      }).error(function (data, status, headers, config) {
        $scope.$emit('notification', { type: 'error', message: "(" + status + ") Could not get resources." });
      });
    };

    $scope.requestResources();

    $scope.showPagination = function () {
      return $scope.resources.length > $scope.itemsPerPage;
    };

    $scope.getNumPages = function () {
      return Math.ceil($scope.resources.length / $scope.itemsPerPage);
    };

    $scope.setPage = function (num) {
      $scope.currentPage = num;
    };

    $scope.openModal = function (index) {
      $scope.modalOpen = true;
      $scope.resourceDel = $scope.resources[index];
    };

    $scope.closeModal = function () {
      $scope.modalOpen = false;
      $scope.resourceDel = undefined;
    };

    $scope.deleteResource = function (id) {
      // Need to fix url
      $http.delete(apiUrlBuilder.createUrl('/resources/'+id)).success(function (data, status, headers, config) {
        // Refresh resources
        $scope.requestResources();
      }).error(function (data, status, headers, config) {
        $scope.$emit('notification', { type: 'error', message: "(" + status + ") Could not delete resource." });
      });

      $scope.closeModal();
    };
  });
