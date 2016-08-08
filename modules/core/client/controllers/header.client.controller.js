(function() {
  'use strict';
  
  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$window', '$state', 'authenticationService', 'menuService', '$mdSidenav', '$mdDialog', '$translate', '$mdComponentRegistry', '$mdMedia'];
  
  function HeaderController ($window ,$state, authenticationService, menuService, $mdSidenav, $mdDialog, $translate, $mdComponentRegistry, $mdMedia) {
    var vm = this,
      langButton = {
        text: {
          en: 'English version',
          es: 'Versión en español'
        },
        class: {
          en: 'translate-button-en',
          es: 'translate-button-es'
        }
      };

    vm.$state = $state;
    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.authentication = authenticationService;
    vm.currentLanguage = $translate.use();
    vm.menu = menuService.getMenu('topbar');
    vm.changeLanguage = changeLanguage;
    vm.hamburguerIconClass = hamburguerIconClass;
    vm.setLanguage = setLanguage;
    vm.showLoginDialog = showLoginDialog;
    vm.signout = signout;
    vm.toggleSidenav = toggleSidenav;

    activate();

    function activate() {      
      vm.sidenavIsMoving = false;
      langButton.language = vm.currentLanguage === 'en' ? 'es' : 'en';
      vm.traslateButtonClass = langButton.class[langButton.language];
      vm.traslateButtonText = langButton.text[langButton.language];
      
      // This waits untill left-sidenav exists to make $mdSidenav look for it
      // Otherwise we'd be getting an error: "No instance found for handle left-sidenav"
      $mdComponentRegistry.when('left-sidenav').then(function(it){
        vm.leftSidenav = $mdSidenav('left-sidenav');
      });
    }

    function changeLanguage() {
      if(vm.currentLanguage === 'en') {
        vm.setLanguage('es');
      } else {
        vm.setLanguage('en');
      }
    }

    function hamburguerIconClass() {
      return (vm.leftSidenav && vm.leftSidenav.isOpen()) ? 'is-active' : '';
    }

    function setLanguage(langKey) {
      var prevKey = vm.currentLanguage;

      $translate.use(langKey)
      .then(function(){
        langButton.language = prevKey;
        vm.currentLanguage = $translate.use();
        vm.traslateButtonText = langButton.text[langButton.language];
        vm.traslateButtonClass = langButton.class[langButton.language];
      });
    }

    function showLoginDialog(ev) {
      $mdDialog.show({
        templateUrl: 'modules/users/client/views/authentication/authentication.client.view.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: $mdMedia('xs')
      });
    }

    function signout() {
      $window.location.href = 'api/auth/signout';
    }

    function toggleSidenav() {
      if (vm.leftSidenav && !vm.sidenavIsMoving){
        vm.sidenavIsMoving = true;
        vm.leftSidenav.toggle()
          .then(function(){
            vm.sidenavIsMoving = false;
          });
      }     
    }
  }
})();