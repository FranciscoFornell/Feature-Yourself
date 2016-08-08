(function () {
  'use strict';

  // Authentication service for user variables

  angular
    .module('users')
    .factory('authenticationService', authenticationService);

  authenticationService.$inject = ['$window'];

  function authenticationService($window) {
    var auth = {
      user: $window.user
    };

    return auth;
  }
}());