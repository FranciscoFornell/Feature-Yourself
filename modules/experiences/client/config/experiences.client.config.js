(function () {
  'use strict';

  angular
    .module('experiences')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Add the dropdown list item to the admin menu
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'MANAGE_EXPERIENCES',
      state: 'admin.experiences.list'
    });
  }
})();
