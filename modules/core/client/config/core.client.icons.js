(function() {
  'use strict';

  angular
  	.module('core')
    .config(iconsConfig);

  iconsConfig.$inject = ['$mdIconProvider'];

  function iconsConfig ($mdIconProvider) {
    $mdIconProvider
      .defaultIconSet('/modules/core/client/img/mdi.svg');
  }
})();