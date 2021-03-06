// Controller for the require authentication view
(function() {
  'use strict';
  
  angular
    .module('users')
    .controller('RequireAuthenticationController', RequireAuthenticationController);

  RequireAuthenticationController.$inject = ['$scope', '$state', 'authenticationService', '$mdDialog', '$translate', '$location', '$mdMedia'];
  
  function RequireAuthenticationController ($scope ,$state, authenticationService, $mdDialog, $translate, $location, $mdMedia) {
    var vm = this;

    vm.authentication = authenticationService;

    activate();
    
    function activate () {
      // If user is signed in then redirect back home
      if (vm.authentication.user){ 
        $location.path('/');
      } else {
        $scope.cancelForbidden = true;    
        showLoginDialog();
      }
    }

    function redirect(){
    // Redirect to the previous or home page
      $state.go($state.previous.state.name || 'home', $state.previous.params);
    }

    function showLoginDialog(){
      $mdDialog.show({
        templateUrl: 'modules/users/client/views/authentication/authentication.client.view.html',
        parent: angular.element(document.body),
        clickOutsideToClose:false,
        fullscreen: $mdMedia('xs'),
        escapeToClose: false,
        scope: $scope,
        onRemoving: redirect
      });
    }
  }
})();