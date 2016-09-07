(function() {
  'use strict';

  angular
    .module('users')
    .controller('AuthenticationController', AuthenticationController);

  AuthenticationController.$inject = ['$scope', '$state', 'usersService', '$location', '$window', 'authenticationService', '$mdDialog', '$translatePartialLoader', '$translate', 'socialProvidersService'];
  
  function AuthenticationController ($scope, $state, usersService, $location, $window, authenticationService, $mdDialog, $translatePartialLoader, $translate, socialProvidersService) {
    var dialogVm = this;
    
    dialogVm.authentication = authenticationService;
    dialogVm.callOauthProvider = callOauthProvider;
    dialogVm.cancel = cancel;
    dialogVm.providersArray = socialProvidersService.configuredProvidersArray;
    dialogVm.signin = signin;
    dialogVm.signup = signup;

    activate();

    function activate() {
      $translatePartialLoader.addPart('users');

      usersService.checkAnyLocalUser()
        .success(function(data, status, headers, config) {
          dialogVm.anyUserExists = data;
          if(dialogVm.anyUserExists){
            dialogVm.loginForm = '/modules/users/client/views/authentication/signin.client.view.html';
            dialogVm.loginType = 'SIGNIN';
          } else {
            dialogVm.loginForm = '/modules/users/client/views/authentication/signup.client.view.html';
            dialogVm.loginType = 'SIGNUP';
          }
        })
        .error(function(data, status, headers, config) {
          dialogVm.error = 'Error checking if there are any users in the database. Status: ' + status;
        });

      // If user is signed in then redirect back home
      if (dialogVm.authentication.user) $mdDialog.cancel();
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
      
      usersService.signin(dialogVm.credentials)
        .success(function(response) {
          // If successful we assign the response to the global user model
          dialogVm.authentication.user = response;

          // And close the dialog
          $mdDialog.hide();
        })
        .error(function(response) {
          dialogVm.error = response.message;
        });
    }

    function signup(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      usersService.signup(dialogVm.credentials)
        .success(function(response) {
          // If successful we assign the response to the global user model
          dialogVm.authentication.user = response;
          $state.reload();

          /// And close the dialog
          $mdDialog.hide();
        })
        .error(function(response) {
          dialogVm.error = response.message;
        });
    }
  }
})();