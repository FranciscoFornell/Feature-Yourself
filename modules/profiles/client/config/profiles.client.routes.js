(function () {
  'use strict';

  angular
    .module('profiles')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.profiles', {
        abstract: true,
        url: '/profiles',
        template: '<ui-view/>'
      })
      .state('admin.profiles.list', {
        url: '',
        templateUrl: 'modules/profiles/client/views/list-profiles.client.view.html',
        controller: 'ProfilesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Profiles List'
        }
      });
  }
})();
