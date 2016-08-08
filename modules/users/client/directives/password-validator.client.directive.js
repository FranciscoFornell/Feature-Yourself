(function() {
  'use strict';

  angular
    .module('users')
    .directive('passwordValidator', passwordValidator);
  
  passwordValidator.$inject = ['passwordValidatorService'];

  function passwordValidator(passwordValidatorService) {
    var directive = {
      require: 'ngModel',
      link: linkFn
    };

    return directive;

    function linkFn(scope, element, attrs, ngModel) {
      ngModel.$validators.requirements = function (password) {
        var status = true;
        if (password) {
          var result = passwordValidatorService.getResult(password);
          var requirementsIdx = 0;

          // Requirements Meter - visual indicator for users
          var requirementsMeter = [
            { color: 'md-progress-danger', progress: '20' },
            { color: 'md-progress-warning', progress: '40' },
            { color: 'md-progress-info', progress: '60' },
            { color: 'md-progress-primary', progress: '80' },
            { color: 'md-progress-success', progress: '100' }
          ];

          if (result.errors.length < requirementsMeter.length) {
            requirementsIdx = requirementsMeter.length - result.errors.length - 1;
          }

          scope.requirementsColor = requirementsMeter[requirementsIdx].color;
          scope.requirementsProgress = requirementsMeter[requirementsIdx].progress;

          // NOTE: He añadido yo los $setValidity
          if (result.errors.length) {
            ngModel.$setValidity('weakpassword', false);
            scope.popoverMsg = passwordValidatorService.getPopoverMsg();
            scope.passwordErrors = result.errors;
            for (var i = 0, len = scope.passwordErrors.length; i < len; i++) {
              if(scope.passwordErrors[i].slice(0,20) === 'The password must be'){
                var j, errorValue;
                if (scope.passwordErrors[i].slice(21,29) === 'at least'){
                  for (j = 0, errorValue = ''; !isNaN(parseInt(scope.passwordErrors[i].slice(30 + j, 30 + j + 1), 10)); j++){
                    errorValue += scope.passwordErrors[i].slice(30 + j, 30 + j + 1);
                  }
                  scope.passwordErrors[i] = 'OWASP_MIN_LENGHT';
                  scope.owaspValue = errorValue;
                } else {
                  for (j = 0, errorValue = ''; !isNaN(parseInt(scope.passwordErrors[i].slice(30 + j, 30 + j + 1), 10)); j++){
                    errorValue += scope.passwordErrors[i].slice(30 + j, 30 + j + 1);
                  }
                  scope.passwordErrors[i] = 'OWASP_MAX_LENGHT';
                  scope.owaspValue = errorValue;
                }
              } else if (scope.passwordErrors[i].slice(0,38) === 'The password may not contain sequences'){
                scope.passwordErrors[i] = 'OWASP_REPEATED_CHARS';
              } else if (scope.passwordErrors[i].slice(0,38) === 'The password must contain at least one'){
                if (scope.passwordErrors[i].slice(39,48) === 'lowercase'){
                  scope.passwordErrors[i] = 'OWASP_REQ_LOWERCASE';
                } else if (scope.passwordErrors[i].slice(39,48) === 'uppercase'){
                  scope.passwordErrors[i] = 'OWASP_REQ_UPPERCASE';
                } else if (scope.passwordErrors[i].slice(39,45) === 'number'){
                  scope.passwordErrors[i] = 'OWASP_REQ_NUMBER';
                } else if (scope.passwordErrors[i].slice(39,46) === 'special'){
                  scope.passwordErrors[i] = 'OWASP_REQ_SPECIAL';
                }
              }
            }
            status = false;
          } else {
            ngModel.$setValidity('weakpassword', true);
            scope.popoverMsg = '';
            scope.passwordErrors = [];
            scope.owaspValue = '';
            status = true;
          }
        }
        return status;
      };
    }
  }
})();