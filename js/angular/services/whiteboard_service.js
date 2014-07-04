var fn = function($firebase){
  return $firebase(new Firebase('https://codecollab.firebaseio.com/collaborations/collab1/whiteboard/data'));
}

app.service('whiteboardService', fn);