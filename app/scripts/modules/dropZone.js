angular.module('ayamelAdminApp')
    .directive('dropZone', function ($http, uploadManager, appSettings, resourceSettings, apiUrlBuilder) {
        var dropZone = {
            restrict: 'A',
            templateUrl: 'views/dropZone.html',
            scope: false,
            link: function (scope, elem, attr) {
                angular.element.event.props.push('dataTransfer'); // jQuery hack, as noted in the jQuery API documentation

                scope.categories = resourceSettings.categories;
                scope.resourceTypes = resourceSettings.types;

                elem.on('dragover', function (e) {
                    e.preventDefault();
                }).on('drop', function (e) {
                    e.preventDefault();

                    scope.$apply(function () {
                        scope.files = [];
                        scope.fileDrop = e.dataTransfer.files;

                        for (var i = 0; i < scope.fileDrop.length; i++) {
                            scope.files.push({
                                name: scope.fileDrop[i].name,
                                size: scope.fileDrop[i].size + ' bytes',
                                file: scope.fileDrop[i]
                            });
                        }

                        scope.submitDisabled = false;
                    });
                });

                elem.children().children('input[type="file"]').on('change', function (e) {
                    scope.files = [];

                    for (var i=0; i < this.files.length; i++) {
                        scope.files.push({
                            name: this.files[i].name,
                            size: this.files[i].size + ' bytes',
                            file: this.files[i]
                        });
                    }

                    scope.submitDisabled = false;

                    scope.$apply();
                });

                scope.fileSubmit = function (index) {
                    var data = {};

                    data.name = scope.files[index].name;
                    data.size = scope.files[index].size;
                    data.description = scope.files[index].description;
                    data.categories = scope.files[index].categories;
                    data.keywords = scope.files[index].keywords;
                    data.license = scope.files[index].license;
                    data.copyright = scope.files[index].copyright;
                    data.visibility = scope.files[index].visibility;
                    data.origin = {};
                    data.origin.creator = scope.files[index].origin.creator;
                    data.origin.location = scope.files[index].origin.location;
                    data.origin.date = scope.files[index].origin.data;
                    data.origin.format = scope.files[index].origin.format;
                    data.origin.note = scope.files[index].origin.note;
                    data.origin.uri = scope.files[index].origin.uri;

                    $http.post(apiUrlBuilder.createUrl('/resources'), data)
                        .success(function (dataReceived) {
                            scope.requestUploadUrl(index, dataReceived.resource.id);
                        })
                        .error(function (error) {
                            scope.$emit('notification', {type: 'error', message: error.response.message});
                        });
                };

                scope.requestUploadUrl = function (index, id) {
                  $http.get(apiUrlBuilder.createUrl('/resources/' + id + '/request-upload-url'))
                    .success(function (data) {
                        scope.files[index].id = id;
                        scope.files[index].token = data.content_upload_url;
                        uploadManager.scheduleJob(scope.files[index]);
                    })
                    .error(function (error) {
                      scope.$emit('notification', {type: 'error', message: error.response.message});
                    });
                };
            }
        };

        return dropZone;
    })
;
