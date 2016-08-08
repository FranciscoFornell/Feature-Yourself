(function() {
  'use strict';

  angular
    .module('users')
    .controller('ChangeProfilePictureController', ChangeProfilePictureController);

  ChangeProfilePictureController.$inject = ['$scope', '$timeout', '$window', 'authenticationService', 'FileUploader'];

  function ChangeProfilePictureController ($scope, $timeout, $window, authenticationService, FileUploader) {
    var vm = this;

    vm.cancelUpload = cancelUpload;
    vm.uploadProfilePicture = uploadProfilePicture;
    vm.user = authenticationService.user;

    activate();

    function activate() {
      vm.imageURL = vm.user.profileImageURL;
      vm.croppedImage = '';

      // Create file uploader instance
      vm.uploader = new FileUploader({
        url: 'api/users/picture',
        alias: 'newProfilePicture',
        onAfterAddingFile: onAfterAddingFile,
        onBeforeUploadItem: onBeforeUploadItem,
        onSuccessItem: onSuccessItem,
        onErrorItem: onErrorItem
      });

      // Set file uploader image filter
      vm.uploader.filters.push({
        name: 'imageFilter',
        fn: function (item, options) {
          var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
          return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
      });
    }

    // Cancel the upload process
    function cancelUpload() {
      vm.uploader.clearQueue();
      vm.imageURL = vm.user.profileImageURL;
    }

    /**
     * Converts data uri to Blob. Necessary for uploading.
     * @see
     *   http://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
     * @param  {String} dataURI
     * @return {Blob}
     */
    function dataURItoBlob(dataURI) {
      var binary = atob(dataURI.split(',')[1]);
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      var array = [];
      for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], { type: mimeString });
    }

    // Called after the user selected a new picture file
    function onAfterAddingFile(fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            vm.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    }

    function onBeforeUploadItem(fileItem) {
      var blob = dataURItoBlob(vm.croppedImage);
      fileItem._file = blob;
    }

    // Called after the user has failed to uploaded a new picture
    function onErrorItem(fileItem, response, status, headers) {
      // Clear upload buttons
      vm.cancelUpload();

      // Show error message
      vm.error = response.message;
    }

    // Called after the user has successfully uploaded a new picture
    function onSuccessItem(fileItem, response, status, headers) {
      // Show success message
      vm.success = true;

      // Populate user object
      vm.user = authenticationService.user = response;

      // Clear upload buttons
      vm.cancelUpload();
    }

    // Change user profile picture
    function uploadProfilePicture() {
      // Clear messages
      vm.success = vm.error = null;

      // Start upload
      vm.uploader.uploadAll();
    }
  }
})();