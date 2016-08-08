(function() {
  'use strict';

  angular
    .module('core')
    .controller('SidenavController', SidenavController);

  SidenavController.$inject = ['$scope', 'authenticationService', 'menuService', '$mdSidenav', '$state'];

  function SidenavController ($scope, authenticationService, menuService, $mdSidenav, $state) {
    var vm = this;
    
    vm.accountMenu = menuService.getMenu('account').items[0];
    // This provides authentication context.
    vm.authentication = authenticationService;
    vm.checkStateContains = checkStateContains;
    vm.closeSidenav = closeSidenav;
    vm.topbarMenu = menuService.getMenu('topbar');

    function checkStateContains(state){
      return ($state.current.name.indexOf(state) !== -1);
    }

    function closeSidenav(){
      $mdSidenav('left-sidenav').close();
    }
  }
})();