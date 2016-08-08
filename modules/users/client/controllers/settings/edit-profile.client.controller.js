(function() {
  'use strict';

  angular
    .module('users')
    .controller('EditProfileController', EditProfileController);

  EditProfileController.$inject = ['$scope', '$http', '$location', 'usersService', 'authenticationService'];
  
  function EditProfileController ($scope, $http, $location, usersService, authenticationService) {
    var vm = this;
    
    vm.updateUserProfile = updateUserProfile;
    vm.user = authenticationService.user;

    // Update a user profile
    function updateUserProfile(isValid) {
      var Users = usersService,
        user = new Users(vm.user);

      vm.success = vm.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');

        vm.success = true;
        authenticationService.user = response;
      }, function (response) {
        vm.error = response.data.message;
      });
    }
  }
})();
