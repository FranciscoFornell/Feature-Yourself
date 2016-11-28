(function() {
  'use strict';

  angular
    .module('users')
    .controller('PreferencesController', PreferencesController);

  PreferencesController.$inject = ['$location', '$stateParams', 'usersService', 'authenticationService'];

  function PreferencesController ($location, $stateParams, usersService, authenticationService) {
    var vm = this;

    vm.updateUserPreferences = updateUserPreferences;

    activate();

    function activate() {
      vm.success = $stateParams.success;
      vm.user = authenticationService.user;
      vm.materialColors = ['red', 'pink', 'purple', 'deep-purple', 'indigo',
        'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime',
        'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'grey', 'blue-grey'];
      vm.user.preferences.theme = vm.user.preferences.theme || {};
      vm.user.preferences.theme.primary = vm.user.preferences.theme.primary || '';
      vm.user.preferences.theme.accent = vm.user.preferences.theme.accent || '';
      vm.user.preferences.theme.warn = vm.user.preferences.theme.warn || '';
      vm.startingTheme = {
        primary: vm.user.preferences.theme.primary,
        accent: vm.user.preferences.theme.accent,
        warn: vm.user.preferences.theme.warn
      };
    }

    function updateUserPreferences(isValid) {
      var Users = usersService,
        user = new Users(vm.user);

      vm.success = vm.error = null;

      if (!isValid) {
        return false;
      }

      user.$update(function (response) {
        if (JSON.stringify(vm.startingTheme) === JSON.stringify(vm.user.preferences.theme)) {
          vm.success = true;
          authenticationService.user = response;
        } else {
          $location.search('success', 'true');
          location.reload();
        }
      }, function (response) {
        vm.error = response.data.message;
      });
    }
  }
})();
