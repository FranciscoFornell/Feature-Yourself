(function () {
  'use strict';

  angular
    .module('profiles')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Add the dropdown list item to the admin menu
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'MANAGE_PROFILES',
      state: 'profiles.list'
    });
  }
})();
