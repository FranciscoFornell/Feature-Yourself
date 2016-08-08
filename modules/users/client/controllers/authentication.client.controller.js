(function() {
  'use strict';

  angular
    .module('users')
    .controller('AuthenticationController', AuthenticationController);

  AuthenticationController.$inject = ['$scope', '$state', 'usersService', '$location', '$window', 'authenticationService', '$mdDialog', '$translatePartialLoader', '$translate', 'socialProvidersService'];
  
  function AuthenticationController ($scope, $state, usersService, $location, $window, authenticationService, $mdDialog, $translatePartialLoader, $translate, socialProvidersService) {
    var vm = this;
    
    vm.authentication = authenticationService;
    vm.callOauthProvider = callOauthProvider;
    vm.cancel = cancel;
    vm.providersArray = socialProvidersService.providersArray;
    vm.signin = signin;
    vm.signup = signup;

    activate();

    function activate() {
      $translatePartialLoader.addPart('users');

      usersService.checkAnyLocalUser()
        .success(function(data, status, headers, config) {
          vm.anyUserExists = data;
          if(vm.anyUserExists){
            vm.loginForm = '/modules/users/client/views/authentication/signin.client.view.html';
            vm.loginType = 'SIGNIN';
          } else {
            vm.loginForm = '/modules/users/client/views/authentication/signup.client.view.html';
            vm.loginType = 'SIGNUP';
          }
        })
        .error(function(data, status, headers, config) {
          vm.error = 'Error checking if there are any users in the database. Status: ' + status;
        });

      // If user is signed in then redirect back home
      if (vm.authentication.user) $mdDialog.cancel();
    }

    // OAuth provider request
    function callOauthProvider(url) {
      $mdDialog.cancel();

      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    }

    function cancel() {
      $mdDialog.cancel();
    }

    function signin(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }
      
      usersService.signin(vm.credentials)
        .success(function(response) {
          // If successful we assign the response to the global user model
          vm.authentication.user = response;

          // And close the dialog
          $mdDialog.hide();
        })
        .error(function(response) {
          vm.error = response.message;
        });
    }

    function signup(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      usersService.signup(vm.credentials)
        .success(function(response) {
          // If successful we assign the response to the global user model
          vm.authentication.user = response;

          /// And close the dialog
          $mdDialog.hide();
        })
        .error(function(response) {
          vm.error = response.message;
        });
    }
  }
})();