(function () {
  'use strict';

  angular
  .module('core')
  .run(MenuConfig);

  MenuConfig.$inject = ['Menus'];

  function MenuConfig(Menus) {

    Menus.addMenu('account', {
      roles: ['user']
    });

    Menus.addMenuItem('account', {
      title: '',
      state: 'settings',
      type: 'dropdown',
      roles: ['user']
    });

    Menus.addSubMenuItem('account', 'settings', {
      title: 'EDIT_PROFILE',
      state: 'settings.profile',
      icon: 'account-check'
    });

    Menus.addSubMenuItem('account', 'settings', {
      title: 'CHANGE_PROF_PIC',
      state: 'settings.picture',
      icon: 'file-image'
    });

    Menus.addSubMenuItem('account', 'settings', {
      title: 'CHANGE_PASSWORD',
      state: 'settings.password',
      icon: 'account-key'
    });

    Menus.addSubMenuItem('account', 'settings', {
      title: 'MANAGE_SOCIAL',
      state: 'settings.accounts',
      icon: 'account-multiple'
    });

  }

})();
