// TODO: Adaptar a hottowel
'use strict';

angular.module('users')
  .directive('passwordValidator', ['PasswordValidator', function(PasswordValidator) {
    return {
      // TODO: Intentar que pase los datos al controlador del elemento padre en lugar de en el scope
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        ngModel.$validators.requirements = function (password) {
          var status = true;
          if (password) {
            var result = PasswordValidator.getResult(password);
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
              scope.popoverMsg = PasswordValidator.getPopoverMsg();
              scope.passwordErrors = result.errors;
              for (var i = 0, len = scope.passwordErrors.length, prefix=''; i < len; i++) {
                prefix = scope.passwordErrors[i].slice(0,16);
                if (prefix === 'OWASP_MIN_LENGHT' || prefix === 'OWASP_MAX_LENGHT'){
                  scope.owaspValue = scope.passwordErrors[i].slice(16,scope.passwordErrors[i].length);
                  scope.passwordErrors[i] = prefix;
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
    };
  }]);
