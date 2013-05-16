angular.module('ayamelAdminApp')
    .directive('dropZone', function (uploadManager) {
        var dropZone = {
            restrict: 'A',
            templateUrl: '../views/dropZone.html',
            scope: false,
            link: function (scope, elem, attr) {
                angular.element.event.props.push('dataTransfer'); // jQuery hack, as noted in the jQuery API documentation
                elem.on('dragover', function (e) {
                    e.preventDefault();
                }).on('drop', function (e) {
                    e.preventDefault();

                    scope.fileDrop = e.dataTransfer.files;

                    for (var i = 0; i < scope.fileDrop.length; i++) {
                        scope.files.push({
                            name: scope.fileDrop[i].name,
                            size: scope.fileDrop[i].size + ' bytes',
                            file: scope.fileDrop[i]
                        });
                    }

                    scope.submitDisabled = false;

                    scope.$apply();
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

                elem.children().children('button').on('click', function (e) {
                    var data = new FormData(), i;

                    for (i = 0; i < scope.files.length; i++) {
                        data.append('file-' + i, scope.files[i].file);
                    }

                    angular.element.ajax({
                        url: '', // insert url here
                        type: 'POST',
                        data: data,
                        contentType: false,
                        processData: false,
                        error: function (e, error) {
                            // TODO: error message
                            console.log('Error has occured');
                            scope.$emit('notification', 'Error');
                        }/*,
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
                        }*/
                    });

                    for (i = 0; i < scope.files.length; i++) {
                        uploadManager.scheduleJob(scope.files[i].name);
                    }

                    scope.fileSubmit = true
                    scope.$apply();
                });
            }
        };

        return dropZone;
    });