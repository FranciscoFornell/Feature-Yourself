// NOTE: Dejo de momento el controlador antiguo comentado
// 'use strict';

// angular.module('users').controller('SocialAccountsController', ['$scope', '$http', 'Authentication',
//   function ($scope, $http, Authentication) {
//     $scope.user = Authentication.user;

//     // Check if there are additional accounts
//     $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
//       for (var i in $scope.user.additionalProvidersData) {
//         return true;
//       }

//       return false;
//     };

//     // Check if provider is already in use with current user
//     $scope.isConnectedSocialAccount = function (provider) {
//       return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
//     };

//     // Remove a user social account
//     $scope.removeUserSocialAccount = function (provider) {
//       $scope.success = $scope.error = null;

//       $http.delete('/api/users/accounts', {
//         params: {
//           provider: provider
//         }
//       }).success(function (response) {
//         // If successful show success message and clear form
//         $scope.success = true;
//         $scope.user = Authentication.user = response;
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
    .controller('SocialAccountsController', SocialAccountsController);

  SocialAccountsController.$inject = ['$scope', '$http', 'Authentication', 'SocialProviders'];

  function SocialAccountsController ($scope, $http, Authentication, SocialProviders) {
    var vm = this;

    vm.user = Authentication.user;
    vm.providersArray = SocialProviders.providersArray;
    vm.providersCollection = SocialProviders.providersCollection;
    vm.mainAccountName = (vm.user.provider === 'local') ? 'Local' : vm.providersCollection[vm.user.provider].name;
    vm.anyUnconnected = false;

    // Check if there are additional accounts
    vm.hasConnectedAdditionalSocialAccounts = function (provider) {
      var countConnected = 0;
      for (var i in vm.user.additionalProvidersData) {
        countConnected++;
      }

      if (countConnected < vm.providersArray.length){
        vm.anyUnconnected = true;
      } else {
        vm.anyUnconnected = false;
      }
      
      if (countConnected > 0){
        return true;
      } else {
        return false; 
      }
    };

    // Check if provider is already in use with current user
    vm.isConnectedSocialAccount = function (provider) {
      return vm.user.provider === provider || (vm.user.additionalProvidersData && vm.user.additionalProvidersData[provider]);
    };

    // Remove a user social account
    vm.removeUserSocialAccount = function (provider) {
      vm.success = vm.error = null;

      $http.delete('/api/users/accounts', {
        params: {
          provider: provider
        }
      }).success(function (response) {
        // If successful show success message and clear form
        vm.success = true;
        vm.user = Authentication.user = response;
      }).error(function (response) {
        vm.error = response.message;
      });
    };
  }
})();