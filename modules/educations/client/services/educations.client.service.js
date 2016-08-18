//Educations service used to communicate Educations REST endpoints
(function () {
  'use strict';

  angular
    .module('educations')
    .factory('educationsService', educationsService);

  educationsService.$inject = ['$resource'];

  function educationsService($resource) {
    return $resource('api/educations/:educationId', {
      educationId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();