(function () {
  'use strict';

  angular
    .module('skills')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.skills', {
        abstract: true,
        url: '/skills',
        template: '<ui-view/>'
      })
      .state('admin.skills.list', {
        url: '',
        templateUrl: 'modules/skills/client/views/list-skills.client.view.html',
        controller: 'SkillsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Skills List'
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