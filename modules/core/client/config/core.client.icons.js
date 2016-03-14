(function(){
  'use strict';

  angular.module('core')
    .config(['$mdIconProvider', function($mdIconProvider) {
      $mdIconProvider
      .defaultIconSet('lib/mdi/mdi.svg');
    }]);
})();