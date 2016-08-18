(function () {
  'use strict';

  angular
    .module('educations')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Add the dropdown list item to the admin menu
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'MANAGE_EDUCATIONS',
      state: 'educations.list'
    });
  }
})();
