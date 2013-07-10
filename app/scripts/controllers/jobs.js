'use strict';

angular.module('ayamelAdminApp')
  .controller('JobsCtrl', function ($scope, uploadManager, apiUrlBuilder) {

    uploadManager.setScope($scope);

    $scope.getPendingJobs = function () {
      return uploadManager.getPendingJobs();
    };

    $scope.getActiveJobs = function () {
      return uploadManager.getActiveJobs();
    };

    $scope.startNextJob = function () {
      uploadManager.startNext();
    }
  })
  .factory('uploadManager', function(uploadManagerSettings, appSettings, $timeout) {
    //TODO: also receive some storage service for recording
    //current and pending jobs, load those when created

    var $scope = null;

    //these simple data structure arrays probably won't work, you'll
    //probably need to key all jobs based on the resource.id

    var active = [
      {
        id: 2394021,
        filename: 'whatever.mp4',
        progress: 75
      },
      {
        id: 2935092,
        filename: 'whatever2.mp4',
        progress: 38
      }
    ];

    var pending = [];

    var updateProgress = function (e, id) {
      for (var i = 0; i < active.length; i++) {
        if (active[i].id === id) {
          active.progress = e.loaded / e.max * 100;
          angular.element('.job:nth-child(' + (i + 1) + ') .bar').width(active.progress + '%');
          break;
        }
      }
    };

    return {
      startNext: function() {
        if (pending.length) {
          var file = pending.shift();

          //TODO: xhr upload to api
          var formData = new FormData();

          formData.append('file', file.file);

          active.push({
            id: file.id,
            filename: file.name,
            progress: 0
          });

          for (var i = 0; i < 4; i++) {
            $timeout(function () {
              updateProgress(
                {
                  loaded: i * 25,
                  max: 100
                },
                file.id
              );
            }, 1000 * (2 * i + 1));
          }

          // File upload
          /*angular.element.ajax({
              url: appSettings.apiEndpoint + '/resources/' + file.id + '/content/' + file.token, // url likely incorrect
              type: 'POST',
              data: formData,
              contentType: false,
              processData: false,
              error: function (e, error) {
                  // TODO: error message
                  scope.$emit('notification', error);
              },
              xhr: function () {
                  var xhr = angular.element.ajaxSettings.xhr();

                  if (xhr.upload) {
                      xhr.upload.addEventListener('progress', function (e) {
                          if (e.lengthComputable) {
                              // TODO: add progress visually
                              // percent progress = e.loaded / e.max
                              updateProgress(e, file.id);
                          }
                      }, false);
                  }

                  return xhr;
              }
          });*/
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
