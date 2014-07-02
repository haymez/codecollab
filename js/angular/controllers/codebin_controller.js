/*
 * Controller for codebin
 */

function fn($scope, $firebase, codebinService) {
  codebinService.$bind($scope, 'code');
}

app.controller('CodebinController', ['$scope', '$firebase', 'codebinService', fn]);