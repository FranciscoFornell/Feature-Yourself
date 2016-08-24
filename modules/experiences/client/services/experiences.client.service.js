//Experiences service used to communicate Experiences REST endpoints
(function () {
  'use strict';

  angular
    .module('experiences')
    .factory('experiencesService', experiencesService);

  experiencesService.$inject = ['$resource'];

  function experiencesService($resource) {
    return $resource('api/experiences/:experienceId', {
      experienceId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();