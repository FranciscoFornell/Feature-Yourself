(function() {
  'use strict';

  angular
    .module('core')
    .config(localizationConfig);

  localizationConfig.$inject = ['$translateProvider', '$translatePartialLoaderProvider'];

  function localizationConfig ($translateProvider, $translatePartialLoaderProvider) {
    $translateProvider
      .useLoader('$translatePartialLoader', {
        urlTemplate: '/modules/{part}/client/i18n/{part}.locale.{lang}.json'
      })
      .registerAvailableLanguageKeys(['en', 'es'], {
        'en_*': 'en',
        'es_*': 'es',
        '*': 'en'
      })        
      .determinePreferredLanguage()
      .useSanitizeValueStrategy('escape')
      .useLocalStorage()
      .use();

    $translatePartialLoaderProvider.addPart('core');
  }
})();