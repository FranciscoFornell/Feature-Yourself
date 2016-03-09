// 'use strict';

// angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator',
//   function ($scope, $state, $http, $location, $window, Authentication, PasswordValidator) {
//     $scope.authentication = Authentication;
//     $scope.popoverMsg = PasswordValidator.getPopoverMsg();

//     // Get an eventual error defined in the URL query string:
//     $scope.error = $location.search().err;

//     // If user is signed in then redirect back home
//     if ($scope.authentication.user) {
//       $location.path('/');
//     }

//     $scope.signup = function (isValid) {
//       $scope.error = null;

//       if (!isValid) {
//         $scope.$broadcast('show-errors-check-validity', 'userForm');

//         return false;
//       }

//       $http.post('/api/auth/signup', $scope.credentials).success(function (response) {
//         // If successful we assign the response to the global user model
//         $scope.authentication.user = response;

//         // And redirect to the previous or home page
//         $state.go($state.previous.state.name || 'home', $state.previous.params);
//       }).error(function (response) {
//         $scope.error = response.message;
//       });
//     };

//     $scope.signin = function (isValid) {
//       $scope.error = null;

//       if (!isValid) {
//         $scope.$broadcast('show-errors-check-validity', 'userForm');

//         return false;
//       }

//       $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
//         // If successful we assign the response to the global user model
//         $scope.authentication.user = response;

//         // And redirect to the previous or home page
//         $state.go($state.previous.state.name || 'home', $state.previous.params);
//       }).error(function (response) {
//         $scope.error = response.message;
//       });
//     };

//     // OAuth provider request
//     $scope.callOauthProvider = function (url) {
//       if ($state.previous && $state.previous.href) {
//         url += '?redirect_to=' + encodeURIComponent($state.previous.href);
//       }

//       // Effectively call OAuth authentication route:
//       $window.location.href = url;
//     };
//   }
// ]);

// NOTE: conservo de momento el controlador anterior comentado
(function(){
  'use strict';

  angular
    .module('users')
    .controller('AuthenticationController', AuthenticationController);

  AuthenticationController.$inject = ['$scope', '$state', '$http', '$location', '$window', 'Authentication', '$mdDialog', '$translatePartialLoader', '$translate', 'SocialProviders'];
  
  function AuthenticationController ($scope, $state, $http, $location, $window, Authentication, $mdDialog, $translatePartialLoader, $translate, SocialProviders) {
    /* jshint validthis: true */

    var vm = this;
    vm.authentication = Authentication;
    vm.providersArray = SocialProviders.providersArray;

    $translatePartialLoader.addPart('users');

    $http.get('/api/users/exists').
      success(function(data, status, headers, config) {
        vm.anyUserExists = data;
        if(vm.anyUserExists){
          vm.loginForm = '/modules/users/client/views/authentication/signin.client.view.html';
          vm.loginType = 'SIGNIN';
        } else {
          vm.loginForm = '/modules/users/client/views/authentication/signup.client.view.html';
          vm.loginType = 'SIGNUP';
        }
      }).
      error(function(data, status, headers, config) {
        vm.error = 'Error checking if there are any users in the database. Status: ' + status;
      });

    // If user is signed in then redirect back home
    if (vm.authentication.user) $mdDialog.cancel();

    vm.signup = function(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signup', vm.credentials).success(function(response) {
        // If successful we assign the response to the global user model
        vm.authentication.user = response;

        /// And close the dialog
        $mdDialog.hide();
      }).error(function(response) {
        vm.error = response.message;
      });
    };

    vm.signin = function(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }
      
      $http.post('/api/auth/signin', vm.credentials).success(function(response) {
        // If successful we assign the response to the global user model
        vm.authentication.user = response;

        // And close the dialog
        $mdDialog.hide();
      }).error(function(response) {
        vm.error = response.message;
      });
    };

    vm.cancel = function() {
      $mdDialog.cancel();
    };

    // OAuth provider request
    vm.callOauthProvider = function (url) {
      $mdDialog.cancel();

      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };
  }
})();