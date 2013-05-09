'use strict';

angular.module('ayamelAdminApp')
  .controller('JobsCtrl', function ($scope, jobManager, appSettings) {

    jobManager.setScope($scope);

    $scope.getPendingJobs = function () {
      return jobManager.getPendingJobs();
    };

    $scope.getActiveJobs = function() {
      return jobManager.getActiveJobs();
    };
  })
  .factory('jobManager', function() {

    var $scope = null;

    var active = [
      {
        filename: 'whatever.mp4',
        progress: 75
      },
      {
        filename: 'whatever2.mp4',
        progress: 38
      }
    ];

    var pending = ['whatever3.mp4'];

    return {
      startNext: function() {
        if (pending.length) {
          var filename = pending.shift();

          //TODO: xhr upload to api

          active.push({
            file: filename,
            progress: 0
          });
        }
      },
      scheduleJob: function(file) {
        pending.push(file);
      },
      getActiveJobs: function() {
        return active;
      },
      getPendingJobs: function() {
        return pending;
      },
      setScope: function(scope) {
        $scope = scope;
      }
    };
  })
 ;
