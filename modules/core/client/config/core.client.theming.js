(function(){
  'use strict';

  angular.module('core')
    .config(['$mdThemingProvider', function($mdThemingProvider) {
      var background = $mdThemingProvider.extendPalette('blue-grey', {
        'A100': 'ffffff'
      });
      $mdThemingProvider.definePalette('background', background);
      $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey')
        .accentPalette('deep-orange')
        .backgroundPalette('background', {
          'default' : 'A100',
          'hue-1'   : '50',
          'hue-2'   : '100',
          'hue-3'   : '200',
        });
    }]);
})();