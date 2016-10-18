(function () {
  'use strict';

  angular
    .module('core')
    .factory('dateTimeUtilsService', dateTimeUtilsService);

  dateTimeUtilsService.$inject = ['$mdDateLocale'];

  function dateTimeUtilsService($mdDateLocale) {
    var service = {
      getDurationInfo: getDurationInfo,
      setDateLocale: setDateLocale
    };

    return service;

    function getDurationInfo(startDate, endDate) {
      var msDifference = endDate.getTime() - startDate.getTime(),
        totalDaysNumber = msDifference / (1000 * 60 * 60 * 24),
        yearsNumber = Math.floor(totalDaysNumber / 365),
        monthsNumber = Math.round((totalDaysNumber % 365) / 30);

      return {
        yearsNumber : yearsNumber,
        monthsNumber: monthsNumber,
        startYear: startDate.getFullYear(),
        endYear: endDate.getFullYear()
      };
    }

    function setDateLocale(langKey) {
      var spanishMonths = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
        englishMonths = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
        spanishShortMonths = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
        englishShortMonths = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
        spanishDays = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sábado'],
        englishDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        spanishShortDays = ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
        englishShortDays = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];

      switch (langKey) {
        case 'es':
          $mdDateLocale.months = spanishMonths;
          $mdDateLocale.shortMonths = spanishShortMonths;
          $mdDateLocale.days = spanishDays;
          $mdDateLocale.shortDays = spanishShortDays;
          $mdDateLocale.firstDayOfWeek = 1;
          $mdDateLocale.parseDate = function(dateString) {
            var dateArray = dateString.split('/'),
              composedDate = new Date(dateArray[2], dateArray[1]-1, dateArray[0]);
            
            return isNaN(composedDate.getTime()) ? new Date(NaN) : composedDate;
          };
          $mdDateLocale.formatDate = function(date) {
            var dateString = '';

            if (date) {
              dateString += date.getDate() + '/';
              dateString += (date.getMonth() + 1) + '/';
              dateString += date.getFullYear();
            }

            return dateString;
          };
          // In addition to date display, date components also need localized messages
          // for aria-labels for screen-reader users.
          $mdDateLocale.weekNumberFormatter = function(weekNumber) {
            return 'Semana ' + weekNumber;
          };
          $mdDateLocale.msgCalendar = 'Calendario';
          $mdDateLocale.msgOpenCalendar = 'Abrir el calendario';
          break;
        case 'en':
          /* falls through */
        default:
          $mdDateLocale.months = englishMonths;
          $mdDateLocale.shortMonths = englishShortMonths;
          $mdDateLocale.days = englishDays;
          $mdDateLocale.shortDays = englishShortDays;
          $mdDateLocale.firstDayOfWeek = 0;
          $mdDateLocale.parseDate = function(dateString) {
            var dateArray = dateString.split('/'),
              composedDate = new Date(dateArray[2], dateArray[0], dateArray[1]-1);
            
            return isNaN(composedDate.getTime()) ? new Date(NaN) : composedDate;
          };
          $mdDateLocale.formatDate = function(date) {
            var dateString = '';

            if (date) {
              dateString += (date.getMonth() + 1) + '/';
              dateString += date.getDate() + '/';
              dateString += date.getFullYear();
            }

            return dateString;
          };
          // In addition to date display, date components also need localized messages
          // for aria-labels for screen-reader users.
          $mdDateLocale.weekNumberFormatter = function(weekNumber) {
            return 'Week ' + weekNumber;
          };
          $mdDateLocale.msgCalendar = 'Calendar';
          $mdDateLocale.msgOpenCalendar = 'Open the calendar';
          break;
      }
    }
  }
}());