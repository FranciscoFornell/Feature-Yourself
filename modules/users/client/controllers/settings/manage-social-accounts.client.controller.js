(function() {
  'use strict';

  angular
    .module('users')
    .controller('SocialAccountsController', SocialAccountsController);

  SocialAccountsController.$inject = ['$scope', '$http', 'usersService', 'authenticationService', 'socialProvidersService'];

  function SocialAccountsController ($scope, $http, usersService, authenticationService, socialProvidersService) {
    var vm = this;

    vm.hasConnectedAdditionalSocialAccounts = hasConnectedAdditionalSocialAccounts;
    vm.isConnectedSocialAccount = isConnectedSocialAccount;
    vm.providersArray = socialProvidersService.providersArray;
    vm.providersCollection = socialProvidersService.providersCollection;
    vm.removeUserSocialAccount = removeUserSocialAccount;
    vm.user = authenticationService.user;

    activate();

    function activate() {
      vm.anyUnconnected = false;
      vm.mainAccountName = (vm.user.provider === 'local') ? 'Local' : vm.providersCollection[vm.user.provider].name;
    }

    // Check if there are additional accounts
    function hasConnectedAdditionalSocialAccounts(provider) {
      var countConnected = 0;
      if (vm.user.additionalProvidersData) {
        countConnected = Object.keys(vm.user.additionalProvidersData).length; 
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
    }

    // Check if provider is already in use with current user
    function isConnectedSocialAccount(provider) {
      return vm.user.provider === provider || (vm.user.additionalProvidersData && vm.user.additionalProvidersData[provider]);
    }

    // Remove a user social account
    function removeUserSocialAccount(provider) {
      vm.success = vm.error = null;

      usersService.removeUserProvider(provider)
        .success(function (response) {
          // If successful show success message and clear form
          vm.success = true;
          vm.user = authenticationService.user = response;
        })
        .error(function (response) {
          vm.error = response.message;
        });
    }
  }
})();