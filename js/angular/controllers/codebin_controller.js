/*
 * Controller for codebin
 */

function fn($scope, $firebase, codebinService) {
  codebinService.$bind($scope, 'code');
  $scope.editorOptions = {
    lineWrapping : true,
    lineNumbers: true,
    mode: 'javascript',
  };
}

app.controller('CodebinController', ['$scope', '$firebase', 'codebinService', fn]);