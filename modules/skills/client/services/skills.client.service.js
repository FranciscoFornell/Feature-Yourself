//Skills service used to communicate Skills REST endpoints
(function () {
  'use strict';

  angular
    .module('skills')
    .factory('skillsService', skillsService);

  skillsService.$inject = ['$resource'];

  function skillsService($resource) {
    return $resource('api/skills/:skillId', {
      skillId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();