var fn = function($firebaseSimpleLogin){
return $firebaseSimpleLogin(new Firebase('https://codecollab.firebaseio.com'));
}

app.service('authenticationService', fn);
