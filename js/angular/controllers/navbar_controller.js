/*
 * Controller for navbar
 */

function fn($scope, $window) {
  
  $scope.isActive = function(viewLocation){
    return viewLocation === $window.location.pathname;
  }
}

app.controller('NavController', ['$scope', '$window', fn]);