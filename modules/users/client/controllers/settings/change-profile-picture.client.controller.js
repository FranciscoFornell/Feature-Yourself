// NOTE: conservo de momento el controlador anterior comentado
// 'use strict';

// angular.module('users').controller('ChangeProfilePictureController', ['$scope', '$timeout', '$window', 'Authentication', 'FileUploader',
//   function ($scope, $timeout, $window, Authentication, FileUploader) {
//     $scope.user = Authentication.user;
//     $scope.imageURL = $scope.user.profileImageURL;

//     // Create file uploader instance
//     $scope.uploader = new FileUploader({
//       url: 'api/users/picture',
//       alias: 'newProfilePicture'
//     });

//     // Set file uploader image filter
//     $scope.uploader.filters.push({
//       name: 'imageFilter',
//       fn: function (item, options) {
//         var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
//         return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
//       }
//     });

//     // Called after the user selected a new picture file
//     $scope.uploader.onAfterAddingFile = function (fileItem) {
//       if ($window.FileReader) {
//         var fileReader = new FileReader();
//         fileReader.readAsDataURL(fileItem._file);

//         fileReader.onload = function (fileReaderEvent) {
//           $timeout(function () {
//             $scope.imageURL = fileReaderEvent.target.result;
//           }, 0);
//         };
//       }
//     };

//     // Called after the user has successfully uploaded a new picture
//     $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
//       // Show success message
//       $scope.success = true;

//       // Populate user object
//       $scope.user = Authentication.user = response;

//       // Clear upload buttons
//       $scope.cancelUpload();
//     };

//     // Called after the user has failed to uploaded a new picture
//     $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
//       // Clear upload buttons
//       $scope.cancelUpload();

//       // Show error message
//       $scope.error = response.message;
//     };

//     // Change user profile picture
//     $scope.uploadProfilePicture = function () {
//       // Clear messages
//       $scope.success = $scope.error = null;

//       // Start upload
//       $scope.uploader.uploadAll();
//     };

//     // Cancel the upload process
//     $scope.cancelUpload = function () {
//       $scope.uploader.clearQueue();
//       $scope.imageURL = $scope.user.profileImageURL;
//     };
//   }
// ]);
(function(){
  'use strict';

  angular
    .module('users')
    .controller('ChangeProfilePictureController', ChangeProfilePictureController);

  ChangeProfilePictureController.$inject = ['$scope', '$timeout', '$window', 'Authentication', 'FileUploader'];

  function ChangeProfilePictureController ($scope, $timeout, $window, Authentication, FileUploader) {
    /* jshint validthis: true */

    var vm = this;
    vm.user = Authentication.user;
    vm.imageURL = _forceUrlRefresh(vm.user.profileImageURL);

    // Create file uploader instance
    vm.uploader = new FileUploader({
      url: 'api/users/picture',
      alias: 'newProfilePicture'
    });

    // Set file uploader image filter
    vm.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    vm.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            vm.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      vm.success = true;

      // Populate user object
      vm.user = Authentication.user = response;

      // Clear upload buttons
      vm.cancelUpload();
    };

    // Called after the user has failed to uploaded a new picture
    vm.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      vm.cancelUpload();

      // Show error message
      vm.error = response.message;
    };

    // Change user profile picture
    vm.uploadProfilePicture = function () {
      // Clear messages
      vm.success = vm.error = null;

      // Start upload
      vm.uploader.uploadAll();
    };

    // Cancel the upload process
    vm.cancelUpload = function () {
      vm.uploader.clearQueue();
      vm.imageURL = _forceUrlRefresh(vm.user.profileImageURL);
    };

    // This function takes an URL string, and returns it with a random parameter if it isn't a data URL.
    // This way any img element using that URL will refresh, instead of using cached data.
    function _forceUrlRefresh(url){      
      var returnedUrl = url;

      if(url && url.substr(0,5) !== 'data:') {
        returnedUrl += '?r=' + Math.round(Math.random() * 999999);
      }

      return returnedUrl;
    }
  }
})();