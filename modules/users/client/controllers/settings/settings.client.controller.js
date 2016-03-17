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

  SettingsController.$inject = ['$scope', 'Authentication', '$translatePartialLoader', '$translate', 'Menus'];

  function SettingsController ($scope, Authentication, $translatePartialLoader, $translate, Menus) {
    /* jshint validthis: true */
    var vm = this;
    vm.user = Authentication.user;
    vm.accountMenu = Menus.getMenu('account').items[0];

    $translatePartialLoader.addPart('users');
  }
})();