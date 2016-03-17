// 'use strict';

// angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus',
//   function ($scope, $state, Authentication, Menus) {
//     // Expose view variables
//     $scope.$state = $state;
//     $scope.authentication = Authentication;

//     // Get the topbar menu
//     $scope.menu = Menus.getMenu('topbar');

//     // Get the account menu
//     $scope.accountMenu = Menus.getMenu('account').items[0];

//     // Toggle the menu items
//     $scope.isCollapsed = false;
//     $scope.toggleCollapsibleMenu = function () {
//       $scope.isCollapsed = !$scope.isCollapsed;
//     };

//     // Collapsing the menu after navigation
//     $scope.$on('$stateChangeSuccess', function () {
//       $scope.isCollapsed = false;
//     });
//   }
// ]);

// Note: mantengo de momento el controlador anterior comentado.
(function(){
  'use strict';
  
  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', '$window', '$state', 'Authentication', 'Menus', '$mdSidenav', '$mdDialog', '$translate', '$mdComponentRegistry'];
  
  function HeaderController ($scope, $window ,$state, Authentication, Menus, $mdSidenav, $mdDialog, $translate, $mdComponentRegistry) {
    /* jshint validthis: true */

    var vm = this;
    var langButton = {
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
    vm.authentication = Authentication;
    vm.currentLanguage = $translate.use();
    langButton.language = vm.currentLanguage === 'en' ? 'es' : 'en';
    vm.traslateButtonText = langButton.text[langButton.language];
    vm.traslateButtonClass = langButton.class[langButton.language];
    vm.accountMenu = Menus.getMenu('account').items[0];
    vm.menu = Menus.getMenu('topbar');

    vm.sidenavIsMoving = false;

    // This waits untill left-sidenav exists to make $mdSidenav look for it
    // Otherwise we'd be getting an error: "No instance found for handle left-sidenav"
    $mdComponentRegistry.when('left-sidenav').then(function(it){
      vm.leftSidenav = $mdSidenav('left-sidenav');
    });

    vm.toggleSidenav = function(){
      if (vm.leftSidenav && !vm.sidenavIsMoving){
        vm.sidenavIsMoving = true;
        vm.leftSidenav.toggle()
          .then(function(){
            vm.sidenavIsMoving = false;
          });
      }     
    };

    vm.hamburguerIconClass = function(){
      return (vm.leftSidenav && vm.leftSidenav.isOpen()) ? 'is-active' : '';
    };

    vm.showLoginDialog = function(ev){
      $mdDialog.show({
        templateUrl: 'modules/users/client/views/authentication/authentication.client.view.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true
      });
    };

    vm.signout = function(){
      $window.location.href = 'api/auth/signout';
    };

    vm.changeLanguage = function(){
      if(vm.currentLanguage === 'en'){
        vm.setLanguage('es');
      } else {
        vm.setLanguage('en');
      }
    };

    vm.setLanguage = function(langKey){
      var prevKey = vm.currentLanguage;

      $translate.use(langKey)
      .then(function(){
        langButton.language = prevKey;
        vm.currentLanguage = $translate.use();
        vm.traslateButtonText = langButton.text[langButton.language];
        vm.traslateButtonClass = langButton.class[langButton.language];
      });
    };
  }
})();