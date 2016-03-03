// NOTE: Dejo de momento el controlador antiguo comentado
// 'use strict';

// angular.module('users').controller('ChangePasswordController', ['$scope', '$http', 'Authentication', 'PasswordValidator',
//   function ($scope, $http, Authentication, PasswordValidator) {
//     $scope.user = Authentication.user;
//     $scope.popoverMsg = PasswordValidator.getPopoverMsg();

//     // Change user password
//     $scope.changeUserPassword = function (isValid) {
//       $scope.success = $scope.error = null;

//       if (!isValid) {
//         $scope.$broadcast('show-errors-check-validity', 'passwordForm');

//         return false;
//       }

//       $http.post('/api/users/password', $scope.passwordDetails).success(function (response) {
//         // If successful show success message and clear form
//         $scope.$broadcast('show-errors-reset', 'passwordForm');
//         $scope.success = true;
//         $scope.passwordDetails = null;
//       }).error(function (response) {
//         $scope.error = response.message;
//       });
//     };
//   }
// ]);
'use strict';

(function(){
  angular
    .module('users')
    .controller('ChangePasswordController', ChangePasswordController);

  ChangePasswordController.$inject = ['$scope', '$http', 'Authentication', 'PasswordValidator'];
  
  function ChangePasswordController ($scope, $http, Authentication, PasswordValidator) {
    /* jshint validthis: true */
    var vm = this;

    vm.user = Authentication.user;
    vm.popoverMsg = PasswordValidator.getPopoverMsg();

    // Change user password
    vm.changeUserPassword = function (isValid) {
      vm.success = vm.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'passwordForm');

        return false;
      }

      $http.post('/api/users/password', vm.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.$broadcast('show-errors-reset', 'passwordForm');
        vm.success = true;
        vm.passwordDetails = null;
      }).error(function (response) {
        vm.error = response.message;
      });
    };
  }
})();