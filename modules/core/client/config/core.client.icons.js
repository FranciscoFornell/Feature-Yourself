(function(){
  'use strict';

  angular.module('core')
    .config(['$mdIconProvider', function($mdIconProvider) {
      $mdIconProvider
      .defaultIconSet('/modules/core/client/img/mdi.svg');
    }]);
})();