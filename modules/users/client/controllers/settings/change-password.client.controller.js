(function() {
  'use strict';

  angular
    .module('users')
    .controller('ChangePasswordController', ChangePasswordController);

  ChangePasswordController.$inject = ['$scope', 'usersService', 'authenticationService', 'passwordValidatorService'];
  
  function ChangePasswordController ($scope, usersService, authenticationService, passwordValidatorService) {
    var vm = this;

    vm.changeUserPassword = changeUserPassword;
    vm.popoverMsg = passwordValidatorService.getPopoverMsg;
    vm.user = authenticationService.user;

    // Change user password
    function changeUserPassword(isValid) {
      vm.success = vm.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'passwordForm');
        if($scope.passwordForm.newPassword.$error.weakpassword){
          vm.error='WEAK_PASSWORD';
        }
        return false;
      }

      usersService.changePassword(vm.passwordDetails)
        .success(function (response) {
          // If successful show success message and clear form
          $scope.$broadcast('show-errors-reset', 'passwordForm');
          vm.success = true;
          vm.passwordDetails = null;
        })
        .error(function (response) {
          vm.error = response.message;
        });
    }
  }
})();