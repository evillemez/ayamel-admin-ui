angular.module('ayamelAdminApp')
    .directive('dropZone', function ($http, uploadManager, resourceSettings) {
        var dropZone = {
            restrict: 'A',
            templateUrl: '../views/dropZone.html',
            scope: false,
            link: function (scope, elem, attr) {
                angular.element.event.props.push('dataTransfer'); // jQuery hack, as noted in the jQuery API documentation

                scope.categories = resourceSettings.categories;
                
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

                    $http.post(appSettings.apiEndpoint + '/resources', data)
                        .success(function (dataReceived) {
                            scope.requestUploadUrl(index, dataReceived.id);
                        })
                        .error(function (error) {
                            scope.$emit('notification', error);
                        });
                };

                scope.requestUploadUrl = function (index, id) {
                    $http.get(appSettings.apiEndpoint + '/resources/' + id + '/request-upload-url')
                        .success(function (data) {
                            scope.fileUpload(index, id, data);
                        })
                        .error(function (error) {
                            scope.$emit('notification', error);
                        });
                };

                scope.fileUpload = function (index, id, data) {
                    var data = new FormData();

                    data.append('file' + index, scope.files[index].file);

                    uploadManager.scheduleJob(scope.files[index].name);

                    angular.element.ajax({
                        url: appSettings.apiEndpoint + '/resources/' + id + '/content/' + data.token, // url likely incorrect
                        type: 'POST',
                        data: data,
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
                                    }
                                }, false);
                            }

                            return xhr;
                        }
                    });
                };
            }
        };

        return dropZone;
    });