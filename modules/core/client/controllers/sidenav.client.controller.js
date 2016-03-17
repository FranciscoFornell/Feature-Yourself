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
    vm.menu = Menus.getMenu('topbar');

    vm.closeSidenav = function(){
      $mdSidenav('left-sidenav').close();
    };
  }
})();