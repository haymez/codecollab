var fn = function($firebase){
  return $firebase(new Firebase('https://codecollab.firebaseio.com/collaborations/collab1/codebin/text'));
}

app.service('codebinService', fn);