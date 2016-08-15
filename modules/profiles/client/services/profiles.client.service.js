//Profiles service used to communicate Profiles REST endpoints
(function () {
  'use strict';

  angular
    .module('profiles')
    .factory('profilesService', profilesService);

  profilesService.$inject = ['$resource'];

  function profilesService($resource) {
    return $resource('api/profiles/:profileId', {
      profileId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
