//Profiles service used to communicate Profiles REST endpoints
(function () {
  'use strict';

  angular
    .module('profiles')
    .factory('profilesService', profilesService);

  profilesService.$inject = ['$resource', '$http'];

  function profilesService($resource, $http) {
    var service = $resource('api/profiles/:profileId', {
      profileId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    service.getIDNameList = getIDNameList;

    return service;

    function getIDNameList() {
      return $http.get('/api/profiles/id_name_list');
    }
  }
})();
