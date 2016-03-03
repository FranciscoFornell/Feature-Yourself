// NOTE: Dejo de momento el controlador antiguo comentado
// 'use strict';

// angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication',
//   function ($scope, $http, $location, Users, Authentication) {
//     $scope.user = Authentication.user;

//     // Update a user profile
//     $scope.updateUserProfile = function (isValid) {
//       $scope.success = $scope.error = null;

//       if (!isValid) {
//         $scope.$broadcast('show-errors-check-validity', 'userForm');

//         return false;
//       }

//       var user = new Users($scope.user);

//       user.$update(function (response) {
//         $scope.$broadcast('show-errors-reset', 'userForm');

//         $scope.success = true;
//         Authentication.user = response;
//       }, function (response) {
//         $scope.error = response.data.message;
//       });
//     };
//   }
// ]);

'use strict';

(function(){
  angular
    .module('users')
    .controller('EditProfileController', EditProfileController);

  EditProfileController.$inject = ['$scope', '$http', '$location', 'Users', 'Authentication'];
  
  function EditProfileController ($scope, $http, $location, Users, Authentication) {
    var vm = this;
    vm.user = Authentication.user;

    // Update a user profile
    vm.updateUserProfile = function (isValid) {
      vm.success = vm.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = new Users(vm.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');

        vm.success = true;
        Authentication.user = response;
      }, function (response) {
        vm.error = response.data.message;
      });
    };
  }
})();
