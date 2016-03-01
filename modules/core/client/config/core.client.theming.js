(function(){
  'use strict';

  angular.module('core')
    .config(['$mdThemingProvider', function($mdThemingProvider) {
      $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey')
        .accentPalette('teal');
    }]);
})();