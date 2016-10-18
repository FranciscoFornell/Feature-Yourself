(function () {
  'use strict';

  angular
    .module('core')
    .factory('iconsService', iconsService);

  iconsService.$inject = ['$log', '$q', '$templateRequest'];

  function iconsService($log, $q, $templateRequest) {
    var urls = [
      {
        prefix: '',
        url: '/modules/core/client/img/mdi.svg'
      },
      {
        prefix: 'fy',
        url: '/modules/core/client/img/fy-icons.svg'
      }],
      i, l,
      promises = [],
      service = {
        icons: []
      };

    for (i = 0, l = urls.length; i < l; i++) {
      promises.push(getIconNames(urls[i].prefix, urls[i].url));
    }
    $q.all(promises).then(function(values){
      var i, l;

      for(i=0, l= values.length; i < l; i++) {
        service.icons = service.icons.concat(values[i]);
      }
    });

    return service;

    function getIconNames(prefix, url) {
      var iconNames = [];

      return $q(function(resolve, reject) {
        // Catch HTTP or generic errors not related to incorrect icon IDs.
        var announceAndReject = function(err) {
            var msg = angular.isString(err) ? err : (err.message || err.data || err.statusText);
            $log.warn(msg);
            reject(err);
          },
          extractSvg = function(response) {
            angular.forEach(angular.element('<div>').append(response).find('g'),
              function(value){
                iconNames.push(prefix ? prefix + ':' + value.id : value.id);
              });
            resolve(iconNames);
          };

        $templateRequest(url, true).then(extractSvg, announceAndReject);
      });
    }
  }
}());