/*
 * Controller for navbar
 */

function fn($scope, $rootScope, $window, authenticationService) {
  
  $scope.logout = function() {
    authenticationService.$logout();
    $rootScope.user = null;
  }
  $scope.isActive = function(viewLocation){
    return viewLocation === $window.location.pathname;
  }
}

app.controller('NavController', ['$scope', '$rootScope', '$window', 'authenticationService', fn]);