(function() {
  'use strict';

  angular
    .module('core')
    .run(['$templateCache', function($templateCache) {
      $templateCache.put('star-rating-bar.html',
        '<ul ng-if="::(max === 5 && readonly !== true)" class="star-rating" style="cursor: pointer;">\n' +
          '<li  ng-style="{color: stars[0].color}" ng-click="toggle(0)">&#9733</li>' +
          '<li  ng-style="{color: stars[1].color}" ng-click="toggle(1)">&#9733</li>' +
          '<li  ng-style="{color: stars[2].color}" ng-click="toggle(2)">&#9733</li>' +
          '<li  ng-style="{color: stars[3].color}" ng-click="toggle(3)">&#9733</li>' +
          '<li  ng-style="{color: stars[4].color}" ng-click="toggle(5)">&#9733</li>' +
        '</ul>\n' +
        '<ul ng-if="::(max !== 5 && readonly !== true)" class="star-rating" style="cursor: pointer;">\n' +
          '<li ng-repeat="star in stars" ng-style="{color: stars[$index].color}" ng-click="toggle($index)">&#9733</li>' +
        '</ul>' +
        '<ul ng-if="::(max === 5 && readonly === true)" class="star-rating">\n' +
          '<li  ng-style="::{color: stars[0].color}">&#9733</li>' +
          '<li  ng-style="::{color: stars[1].color}">&#9733</li>' +
          '<li  ng-style="::{color: stars[2].color}">&#9733</li>' +
          '<li  ng-style="::{color: stars[3].color}">&#9733</li>' +
          '<li  ng-style="::{color: stars[4].color}">&#9733</li>' +
        '</ul>\n' +
        '<ul ng-if="::(max !== 5 && readonly === true)" class="star-rating">\n' +
          '<li ng-repeat="star in ::stars" ng-style="::{color: stars[$index].color}">&#9733</li>' +
        '</ul>');
    }])
    .directive('starRating', starRating);

  function starRating() {
    return {
      restrict: 'EA',
      templateUrl: 'star-rating-bar.html',
      scope: {
        ratingValue: '=ngModel',
        max: '=?', // optional (default is 5)
        onRatingSelect: '&?',
        readonly: '=?'
      },
      link: function(scope, element, attributes) {
        if (scope.max === undefined) {
          scope.max = 5;
        }
        function updateStars() {
          scope.stars = [];
          for (var i = 0; i < scope.max; i++) {
            scope.stars.push({
              color: i < scope.ratingValue ? '#FFDD00' : '#DDDDDD'
            });
          }
        }
        scope.toggle = function(index) {
          if (scope.readonly === undefined || scope.readonly === false){
            scope.ratingValue = index + 1;
            if(scope.onRatingSelect){
              scope.onRatingSelect({
                rating: index + 1
              });
            }
          }
        };
        scope.$watch('ratingValue', function(oldValue, newValue) {
          if (newValue) {
            updateStars();
          }
        });
      }
    };
  }
})();