(function () {
  'use strict';

  angular
    .module('experiences')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.experiences', {
        abstract: true,
        url: '/experiences',
        template: '<ui-view/>'
      })
      .state('admin.experiences.list', {
        url: '',
        templateUrl: 'modules/experiences/client/views/list-experiences.client.view.html',
        controller: 'ExperiencesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Experiences List'
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