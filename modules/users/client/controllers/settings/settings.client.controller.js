// NOTE: Dejo de momento el controlador antiguo comentado
// 'use strict';

// angular.module('users').controller('SettingsController', ['$scope', 'Authentication',
//   function ($scope, Authentication) {
//     $scope.user = Authentication.user;
//   }
// ]);

(function(){
  'use strict';

  angular
  	.module('users')
  	.controller('SettingsController', SettingsController);

  SettingsController.$inject = ['$scope', 'Authentication', '$translatePartialLoader', '$translate'];

  function SettingsController ($scope, Authentication, $translatePartialLoader, $translate) {
    /* jshint validthis: true */
    var vm = this;
    vm.user = Authentication.user;

    $translatePartialLoader.addPart('users');
  }
})();