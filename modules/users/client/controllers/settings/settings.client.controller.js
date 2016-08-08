(function() {
  'use strict';

  angular
  	.module('users')
  	.controller('SettingsController', SettingsController);

  SettingsController.$inject = ['$scope', 'authenticationService', '$translatePartialLoader', '$translate', 'menuService'];

  function SettingsController ($scope, authenticationService, $translatePartialLoader, $translate, menuService) {
    var vm = this;
    
    vm.user = authenticationService.user;
    vm.accountMenu = menuService.getMenu('account').items[0];

    $translatePartialLoader.addPart('users');
  }
})();