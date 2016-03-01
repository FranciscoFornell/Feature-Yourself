// 'use strict';

// angular.module('core').controller('HomeController', ['$scope', 'Authentication',
//   function ($scope, Authentication) {
//     // This provides Authentication context.
//     $scope.authentication = Authentication;
//   }
// ]);

(function(){
  'use strict';

  angular
  	.module('core')
  	.controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', 'Authentication'];

  function HomeController ($scope, Authentication) {
  	/* jshint validthis: true */

    var vm = this;
    // This provides Authentication context.
    vm.authentication = Authentication;
  }
})();