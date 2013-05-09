'use strict';

angular.module('ayamelAdminApp')
  .controller('JobsCtrl', function ($scope, uploadManager, appSettings) {

    uploadManager.setScope($scope);

    $scope.getPendingJobs = function () {
      return uploadManager.getPendingJobs();
    };

    $scope.getActiveJobs = function() {
      return uploadManager.getActiveJobs();
    };
  })
  .factory('uploadManager', function(uploadManagerSettings) {
    //TODO: also receive some storage service for recording
    //current and pending jobs, load those when created

    var $scope = null;

    //these simple data structure arrays probably won't work, you'll
    //probably need to key all jobs based on the resource.id

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
