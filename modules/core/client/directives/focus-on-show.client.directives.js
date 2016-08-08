(function() {
  'use strict';
  
  angular
    .module('core')
    .directive('focusOnShow', focusOnShow);

  focusOnShow.$inject = ['$timeout'];
  
  function focusOnShow ($timeout) {
    /* jshint validthis: true */

    var directive = {
      restrict: 'A',
      link: linkFunc
    };

    return directive;

    function linkFunc(scope, $element, $attr) {
      if ($attr.ngShow){
        scope.$watch($attr.ngShow, function(newValue){
          if(newValue){
            $timeout(function(){
              $element[0].focus();
            }, 50);
          }
        });
      }
      if ($attr.ngHide){
        scope.$watch($attr.ngHide, function(newValue){
          if(!newValue){
            $timeout(function(){
              $element[0].focus();
            }, 50);
          }
        });
      }
    }
  }
})();