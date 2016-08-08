(function() {
  'use strict';

  // Setting up route
  angular
    .module('core.admin.routes')
    .config(routeConfig);
    
  routeConfig.$inject = ['$stateProvider'];

  function routeConfig ($stateProvider) {
    $stateProvider
      .state('admin', {
        abstract: true,
        url: '/admin',
        template: '<ui-view/>',
        data: {
          roles: ['admin']
        }
      });
  }
})();