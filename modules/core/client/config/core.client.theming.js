(function() {
  'use strict';

  angular
    .module('core')
    .config(themingConfig);

  themingConfig.$inject = ['$mdThemingProvider'];

  function themingConfig ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('blue-grey')
      .accentPalette('deep-orange');
  }
})();