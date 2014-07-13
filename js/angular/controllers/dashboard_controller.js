/*
 * Controller for dashboard
 * Also handles logging in
 */

function fn($scope, $rootScope, $firebase, $firebaseSimpleLogin, authenticationService, userService) {
  $scope.firstName = '';
  $scope.lastName = '';
  $scope.email = '';
  $scope.password = '';
  $scope.newUserForm = false;

  $scope.login = function() {
    authenticationService.$login('password', {
      email: $scope.email,
      password: $scope.password
    }).then(function(user) {
      //Logged in succesfully
    }, function(error) {
      console.error('Login failed: ', error);
    });
  }
  $scope.createUser = function() {
    authenticationService.$createUser($scope.email, $scope.password)
    .then(function(user) {
      console.log(user);
      userService.$child(user.id).$set({
        firstName: $scope.firstName,
        lastName: $scope.lastName,
        email: $scope.email
      });
    }, function(error) {
      console.log(error);
    });
  }

  $scope.logout = function() {
    authenticationService.$logout();
  }

  $scope.$on("$firebaseSimpleLogin:login", function(e, user) {
    $rootScope.user = user;
    userService.$child($rootScope.user.id).$on('value', function(child) {
      $scope.userInfo = child.snapshot;
      userService.$child($rootScope.user.id).$off();
      console.log('Logged in as: ', $scope.userInfo.value.firstName, $scope.userInfo.value.lastName);
    });
  });

  $scope.$watch('$root.user', function() {
    if($rootScope.user === null) {
      $scope.firstName = '';
      $scope.lastName = '';
      $scope.email = '';
      $scope.password = '';
    }
  });
}

app.controller('DashboardController', ['$scope', '$rootScope', '$firebase', '$firebaseSimpleLogin', 'authenticationService', 'userService', fn])