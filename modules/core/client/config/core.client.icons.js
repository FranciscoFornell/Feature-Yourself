(function(){
  'use strict';

  angular.module('core')
    .config(['$mdIconProvider', function($mdIconProvider) {
      $mdIconProvider
      .defaultIconSet('lib/angular-material/mdi.svg');
    }]);
})();