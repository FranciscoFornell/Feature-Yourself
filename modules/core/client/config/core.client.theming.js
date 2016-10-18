(function(app) {
  'use strict';

  angular
    .module('core')
    .config(themingConfig);

  themingConfig.$inject = ['$mdThemingProvider'];

  function themingConfig ($mdThemingProvider) {
    var themeSettings = app.themeSettings;

    $mdThemingProvider.theme('default')
      .primaryPalette(themeSettings.primaryPalette)
      .accentPalette(themeSettings.accentPalette)
      .warnPalette(themeSettings.warnPalette);
  }
})(ApplicationConfiguration);