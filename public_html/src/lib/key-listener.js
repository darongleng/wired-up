var app = angular.module("appMyExample");

app.directive('shortcut', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: true,
    link:    function postLink(scope, iElement, iAttrs){
       document.onkeypress = function(e){
         scope.$apply(scope.keyPressed(e));
       }
       document.onkeyup = function(e){
         scope.$apply(scope.keyUp(e));
       }
    }
  };
});