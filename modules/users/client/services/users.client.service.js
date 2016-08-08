(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('users')
    .factory('usersService', usersService);

  usersService.$inject = ['$resource', '$http'];

  function usersService($resource, $http) {
    var service = $resource('api/users', {}, {
      update: {
        method: 'PUT'
      }
    });

    service.changePassword = changePassword;
    service.checkAnyLocalUser = checkAnyLocalUser;
    service.forgotPassword = forgotPassword;
    service.getLocalUser = getLocalUser;
    service.removeUserProvider = removeUserProvider;
    service.resetPassword = resetPassword;
    service.signin = signin;
    service.signup = signup;

    return service;

    function changePassword(passwordDetails) {
      return $http.post('/api/users/password', passwordDetails);
    }

    function checkAnyLocalUser(passwordDetails) {
      return $http.get('/api/users/exists');
    }

    function forgotPassword(credentials) {
      return $http.post('/api/auth/forgot', credentials);
    }

    function getLocalUser() {
      return $http.get('/api/users/local');
    }

    function removeUserProvider(provider) {
      return $http.delete('/api/users/accounts',
        {
          params: { 
            provider: provider
          }
        });
    }

    function resetPassword(token, passwordDetails) {
      return $http.post('/api/auth/reset/' + token, passwordDetails);
    }

    function signin(credentials) {
      return $http.post('/api/auth/signin', credentials);
    }

    function signup(credentials) {
      return $http.post('/api/auth/signup', credentials);
    }
  }

  // TODO this should be Users service
  angular
    .module('users.admin')
    .factory('Admin', Admin);

  Admin.$inject = ['$resource'];

  function Admin($resource) {
    return $resource('api/users/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());