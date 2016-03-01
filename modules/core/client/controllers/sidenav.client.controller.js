(function(){
  'use strict';

  angular
    .module('core')
    .controller('SidenavController', SidenavController);

  SidenavController.$inject = ['$scope', 'Authentication', 'Menus', '$mdSidenav'];

  function SidenavController ($scope, Authentication, Menus, $mdSidenav) {
    /* jshint validthis: true */

    var vm = this;
    // This provides Authentication context.
    vm.authentication = Authentication;
    vm.menu = Menus.getMenu('topbar');
  }
})();