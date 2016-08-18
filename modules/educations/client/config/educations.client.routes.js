(function () {
  'use strict';

  angular
    .module('educations')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('educations', {
        abstract: true,
        url: '/educations',
        template: '<ui-view/>'
      })
      .state('educations.list', {
        url: '',
        templateUrl: 'modules/educations/client/views/list-educations.client.view.html',
        controller: 'EducationsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Educations List'
        },
        resolve: {
          profileListService: profileListService
        }
      });
  }

  profileListService.$inject = ['profilesService'];

  function profileListService(profilesService) {
    return profilesService.getIDNameList();
  }
})();