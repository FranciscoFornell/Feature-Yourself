(function () {
  'use strict';

  // passwordValidatorService service used for testing the password strength
  angular
    .module('users')
    .factory('passwordValidatorService', passwordValidatorService);

  passwordValidatorService.$inject = ['$window'];

  function passwordValidatorService($window) {
    var owaspPasswordStrengthTest = $window.owaspPasswordStrengthTest;

    var service = {
      getResult: getResult,
      getPopoverMsg: getPopoverMsg
    };

    return service;

    function getResult(password) {
      var result = owaspPasswordStrengthTest.test(password);
      return result;
    }

    function getPopoverMsg() {
      var popoverMsg = 'Please enter a passphrase or password with 10 or more characters, numbers, lowercase, uppercase, and special characters.';

      return popoverMsg;
    }
  }

}());