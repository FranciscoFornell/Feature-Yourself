(function() {
  'use strict';

  angular
    .module('core')
    .directive('starRating', starRating);

  starRating.$inject = ['$timeout', '$compile'];

  function starRating($timeout, $compile) {
    var directive = {
      restrict: 'E',
      scope: {
        ratingValue: '=ngModel',
        max: '=?', // optional (default is 5)
        onRatingSelect: '&?',
        readonly: '=?',
        onUpdate: '&?'
      },
      link: linkFn
    };

    return directive;

    function linkFn(scope, element, attributes) {
      var templates = {
          defaultSize:
            '<ul class="star-rating" style="cursor: pointer;">\n' +
              '<li  ng-style="{color: stars[0].color}" ng-click="toggle(0)">&#9733</li>' +
              '<li  ng-style="{color: stars[1].color}" ng-click="toggle(1)">&#9733</li>' +
              '<li  ng-style="{color: stars[2].color}" ng-click="toggle(2)">&#9733</li>' +
              '<li  ng-style="{color: stars[3].color}" ng-click="toggle(3)">&#9733</li>' +
              '<li  ng-style="{color: stars[4].color}" ng-click="toggle(4)">&#9733</li>' +
            '</ul>',
          defaultSizeReadonly:
            '<ul class="star-rating">\n' +
              '<li  ng-style="::{color: stars[0].color}">&#9733</li>' +
              '<li  ng-style="::{color: stars[1].color}">&#9733</li>' +
              '<li  ng-style="::{color: stars[2].color}">&#9733</li>' +
              '<li  ng-style="::{color: stars[3].color}">&#9733</li>' +
              '<li  ng-style="::{color: stars[4].color}">&#9733</li>' +
            '</ul>',
          anySize:
            '<ul class="star-rating" style="cursor: pointer;">\n' +
              '<li ng-repeat="star in stars" ng-style="{color: stars[$index].color}" ng-click="toggle($index)">&#9733</li>' +
            '</ul>',
          anySizeReadonly:
            '<ul class="star-rating">\n' +
              '<li ng-repeat="star in ::stars" ng-style="::{color: stars[$index].color}">&#9733</li>' +
            '</ul>'
        },
        template = '';

      if (scope.max === undefined) {
        scope.max = 5;
      }

      if(scope.max === 5) {
        if(scope.readonly) {
          template = templates.defaultSizeReadonly;
        } else {
          template = templates.defaultSize;
        }
      } else {
        if(scope.readonly) {
          template = templates.anySizeReadonly;
        } else {
          template = templates.anySize;
        }
      }

      element.html(template);
      $compile(element.contents())(scope);
      
      scope.toggle = toggle;

      if (scope.readonly) {
        updateStars();
      } else {
        scope.$watch('ratingValue', function(oldValue, newValue) {
          if (newValue) {
            updateStars();
          }
        });
      }

      function toggle (index) {
        if (scope.readonly === undefined || scope.readonly === false){
          scope.ratingValue = index + 1;
          if(scope.onRatingSelect){
            scope.onRatingSelect({
              rating: index + 1
            });
          }
          if (scope.onUpdate){
            $timeout(scope.onUpdate, 300);
          }
        }
      }

      function updateStars() {
        scope.stars = [];
        for (var i = 0; i < scope.max; i++) {
          scope.stars.push({
            color: i < scope.ratingValue ? '#FFDD00' : '#DDDDDD'
          });
        }
      }
    }
  }
})();