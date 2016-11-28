(function(app) {
  'use strict';

  angular
    .module('core')
    .config(themingConfig);

  themingConfig.$inject = ['$mdThemingProvider'];

  function themingConfig ($mdThemingProvider) {
    var themeSettings = app.themeSettings,
      theme = app.userSettings.theme;

    setDefaultTheme(theme.primary, theme.accent, theme.warn);

    function setDefaultTheme (primary, accent, warn) {
      $mdThemingProvider.theme('default')
        .primaryPalette(primary || themeSettings.primaryPalette)
        .accentPalette(accent || themeSettings.accentPalette)
        .warnPalette(warn || themeSettings.warnPalette);
    }
  }
})(ApplicationConfiguration);