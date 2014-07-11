/*
 * Controller for codebin
 */

function fn($scope, $firebase, codebinService) {
  codebinService.$child('code').$bind($scope, 'code');
  codebinService.$child('codeType').$bind($scope, 'codeType');
  codebinService.$child('theme').$bind($scope, 'theme');
  $scope.modes = [
    'coffeescript',
    'css',
    'go',
    'haml',
    'javascript',
    'markdown',
    'php',
    'python',
    'ruby',
    'sql',
    'xml'
  ];
  $scope.themes = [
    '3024-day',
    'ambiance',
    'blackboard',
    'cobalt',
    'eclipse',
    'neat',
    'neo',
    'paraiso-light',
    'solarized',
    'vibrant-ink'
  ];
  $scope.editorOptions = {
    onLoad : function(cm){
      $scope.modeChanged = function(){
        cm.setOption('mode', $scope.codeType.toLowerCase());
        cm.setOption('theme', $scope.theme.toLowerCase());
      };
    },
    lineWrapping : false,
    lineNumbers: true,
    smartIndent: false,
    electricChars: false,
    showCursorWhenSelecting: true
  }

  $scope.$watch('codeType', function() {
    if($scope.codeType !== undefined && $scope.theme !== undefined) $scope.modeChanged();
  });
  $scope.$watch('theme', function() {
    if($scope.codeType !== undefined && $scope.theme !== undefined) $scope.modeChanged();
  });

}

app.controller('CodebinController', ['$scope', '$firebase', 'codebinService', fn]);