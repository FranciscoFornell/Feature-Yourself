(function(){
  'use strict';

  angular
    .module('core')
    .controller('SidenavController', SidenavController);

  SidenavController.$inject = ['$scope', 'Authentication', 'Menus', '$mdSidenav', '$state'];

  function SidenavController ($scope, Authentication, Menus, $mdSidenav, $state) {
    /* jshint validthis: true */

    var vm = this;
    // This provides Authentication context.
    vm.authentication = Authentication;
    vm.topbarMenu = Menus.getMenu('topbar');
    vm.accountMenu = Menus.getMenu('account').items[0];

    vm.checkStateContains = function(state){
      return ($state.current.name.indexOf(state) !== -1);
    };

    vm.closeSidenav = function(){
      $mdSidenav('left-sidenav').close();
    };
  }
})();