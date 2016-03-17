'use strict';

// Configuring the Users module
angular.module('users.admin').run(['Menus',
  function (Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'MANAGE_USERS',
      state: 'admin.users'
    });
  }
]);
