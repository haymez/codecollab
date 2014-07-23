/*
 * Controller for codebin
 */

 function fn($scope, $rootScope, $firebase, userService) {
  $scope.collabList = [];
  $scope.collab = '';
  var ref = null;

  //Listen for login callback
  $scope.$on("$firebaseSimpleLogin:login", function(e, user) {
    $rootScope.user = user;
    userService.$child($rootScope.user.id).$on('value', function(child) {
      $scope.userInfo = child.snapshot;
      userService.$child($rootScope.user.id).$off();
      $scope.collabRef = $firebase(new Firebase('https://codecollab.firebaseio.com/users/' + 
      $scope.userInfo.name + '/collab_list'));
    });
  });


  $scope.$watch('collab', function() {
    console.log("changed")
    if(!!$scope.collab) {
      if (ref) ref.unauth();
      ref = new Firebase('https://codecollab.firebaseio.com/users/' + 
      $scope.userInfo.name + '/collab_list/' + $scope.collab.$id + '/codebin/')
      var codebinRef = $firebase(ref);
      codebinRef.$child('code').$bind($scope, 'code');
      codebinRef.$child('codeType').$bind($scope, 'codeType');
      codebinRef.$child('theme').$bind($scope, 'theme');    }
  });

  $scope.$watch('collabRef', function() {
    if(!!$scope.collabRef && $scope.collabList.length == 0) {
      $scope.collabRef.$on('value', function(snapshot) {
        var collabList = snapshot.snapshot.value;
        for(i in collabList) {
          collabList[i].$id = i;
          $scope.collabList.push(collabList[i])
        }
        $scope.collabRef.$off();
      });
    }
  });

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

app.controller('CodebinController', ['$scope', '$rootScope', '$firebase', 'userService', fn]);