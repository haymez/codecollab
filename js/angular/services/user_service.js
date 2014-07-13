var fn = function($firebase){
  return $firebase(new Firebase('https://codecollab.firebaseio.com/users'));
}

app.service('userService', fn);