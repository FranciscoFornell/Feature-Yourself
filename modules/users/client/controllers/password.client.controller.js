// NOTE: Dejo de momento el controlador antiguo conmentado
// 'use strict';

// angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'PasswordValidator',
//   function ($scope, $stateParams, $http, $location, Authentication, PasswordValidator) {
//     $scope.authentication = Authentication;
//     $scope.popoverMsg = PasswordValidator.getPopoverMsg();

//     // If user is signed in then redirect back home
//     if ($scope.authentication.user) {
//       $location.path('/');
//     }

//     // Submit forgotten password account id
//     $scope.askForPasswordReset = function (isValid) {
//       $scope.success = $scope.error = null;

//       if (!isValid) {
//         $scope.$broadcast('show-errors-check-validity', 'forgotPasswordForm');

//         return false;
//       }

//       $http.post('/api/auth/forgot', $scope.credentials).success(function (response) {
//         // Show user success message and clear form
//         $scope.credentials = null;
//         $scope.success = response.message;

//       }).error(function (response) {
//         // Show user error message and clear form
//         $scope.credentials = null;
//         $scope.error = response.message;
//       });
//     };

//     // Change user password
//     $scope.resetUserPassword = function (isValid) {
//       $scope.success = $scope.error = null;

//       if (!isValid) {
//         $scope.$broadcast('show-errors-check-validity', 'resetPasswordForm');

//         return false;
//       }

//       $http.post('/api/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
//         // If successful show success message and clear form
//         $scope.passwordDetails = null;

//         // Attach user profile
//         Authentication.user = response;

//         // And redirect to the index page
//         $location.path('/password/reset/success');
//       }).error(function (response) {
//         $scope.error = response.message;
//       });
//     };
//   }
// ]);
(function(){
  'use strict';

  angular
    .module('users')
    .controller('PasswordController', PasswordController);

  PasswordController.$inject = ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'PasswordValidator', '$translatePartialLoader', '$translate'];

  function PasswordController ($scope, $stateParams, $http, $location, Authentication, PasswordValidator, $translatePartialLoader, $translate) {
    /* jshint validthis: true */

    var vm = this;
    vm.authentication = Authentication;
    vm.popoverMsg = PasswordValidator.getPopoverMsg();

    $translatePartialLoader.addPart('users');

    //If user is signed in then redirect back home
    if (vm.authentication.user) {
      $location.path('/');
    }

    // Submit forgotten password account id
    vm.askForPasswordReset = function (isValid) {
      vm.success = vm.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'forgotPasswordForm');

        return false;
      }

      $http.post('/api/auth/forgot', vm.credentials).success(function (response) {
        // Show user success message and clear form
        vm.credentials = null;
        vm.success = response.message;

      }).error(function (response) {
        // Show user error message and clear form
        vm.credentials = null;
        vm.error = response.message;
      });
    };

    // Change user password
    vm.resetUserPassword = function (isValid) {
      vm.success = vm.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'resetPasswordForm');
        if($scope.resetPasswordForm.newPassword.$error.weakpassword){
          vm.error='WEAK_PASSWORD';
        }

        return false;
      }

      $http.post('/api/auth/reset/' + $stateParams.token, vm.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        vm.passwordDetails = null;

        // Attach user profile
        Authentication.user = response;

        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        vm.error = response.message;
      });
    };
  }
})();
