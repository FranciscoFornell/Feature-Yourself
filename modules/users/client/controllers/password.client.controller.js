(function() {
  'use strict';

  angular
    .module('users')
    .controller('PasswordController', PasswordController);

  PasswordController.$inject = ['$scope', '$stateParams', 'usersService', '$location', 'authenticationService', 'passwordValidatorService', '$translatePartialLoader', '$translate'];

  function PasswordController ($scope, $stateParams, usersService, $location, authenticationService, passwordValidatorService, $translatePartialLoader, $translate) {
    var vm = this;

    vm.askForPasswordReset = askForPasswordReset;
    vm.authentication = authenticationService;
    vm.popoverMsg = passwordValidatorService.getPopoverMsg();
    vm.resetUserPassword = resetUserPassword;

    activate();

    function activate() {
      $translatePartialLoader.addPart('users');

      //If user is signed in then redirect back home
      if (vm.authentication.user) {
        $location.path('/');
      }
    }

    // Submit forgotten password account id
    function askForPasswordReset(isValid) {
      vm.success = vm.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'forgotPasswordForm');

        return false;
      }

      usersService.forgotPassword(vm.credentials)
        .success(function (response) {
          // Show user success message and clear form
          vm.credentials = null;
          vm.success = response.message;

        })
        .error(function (response) {
          // Show user error message and clear form
          vm.credentials = null;
          vm.error = response.message;
        });
    }

    // Change user password
    function resetUserPassword(isValid) {
      vm.success = vm.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'resetPasswordForm');
        if($scope.resetPasswordForm.newPassword.$error.weakpassword){
          vm.error='WEAK_PASSWORD';
        }

        return false;
      }

      usersService.resetPassword($stateParams.token, vm.passwordDetails)
        .success(function (response) {
          // If successful show success message and clear form
          vm.passwordDetails = null;

          // Attach user profile
          authenticationService.user = response;

          // And redirect to the index page
          $location.path('/password/reset/success');
        })
        .error(function (response) {
          vm.error = response.message;
        });
    }
  }
})();
