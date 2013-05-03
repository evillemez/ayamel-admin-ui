angular.module('ayamelAdminApp')
  .controller('NotificationsCtrl', function($scope, $timeout, appSettings) {
    $scope.notifications = [];

    //listen for notifications that may bubble up
    $scope.$on('notification', function(evt, data) {
      $scope.notifications.push(data);

      $timeout(function() {
      	$scope.notifications.shift();
      }, appSettings.notificationTimeout);
    });

    $scope.removeNotification = function (id) {
    	throw new Error("TODO");
    };

    $scope.clear = function() {
      $scope.notifications = [];
    };

  })
;
