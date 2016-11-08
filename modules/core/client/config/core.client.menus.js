(function() {
  'use strict';

  angular
    .module('core')
    .run(MenuConfig);

  MenuConfig.$inject = ['menuService'];

  function MenuConfig(menuService) {

    menuService.addMenu('account', {
      roles: ['user']
    });

    menuService.addMenuItem('account', {
      title: '',
      state: 'settings',
      type: 'dropdown',
      roles: ['user']
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: 'EDIT_PROFILE',
      state: 'settings.profile',
      icon: 'account-check'
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: 'CHANGE_PROF_PIC',
      state: 'settings.picture',
      icon: 'file-image'
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: 'CHANGE_PASSWORD',
      state: 'settings.password',
      icon: 'account-key',
      roles: ['admin']
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: 'MANAGE_SOCIAL',
      state: 'settings.accounts',
      icon: 'account-multiple'
    });
  }
})();
