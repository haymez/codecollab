/*
 * Controller for whiteboard
 */

function fn($scope, $firebase, whiteboardService) {
  // whiteboardService.$bind($scope, 'data');
  var canvas = $('#canvas');
  var x;
  var y;
  var dragging = false;
  var color = 'black';

  $scope.clear = function() {
    var ctx = canvas[0].getContext('2d');
    ctx.clearRect (0, 0, canvas.width(), canvas.height());
  }

  $scope.clearData = function() {
    whiteboardService.$set("");
  }

  canvas.on('vmousemove', function(evt) {
    evt.preventDefault();
    x = Math.round(evt.clientX - canvas.offset().left);
    y = Math.round(evt.clientY - canvas.offset().top);
    if(dragging) {
      var ctx = canvas[0].getContext('2d');
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.arc(x,y,5,0,2*Math.PI);
      ctx.fill();

      //save
      whiteboardService.$add({x: x, y: y, color: color});
    }
  });

  canvas.on('vmousedown', function(evt) {
    dragging = true;
  }).on('vmouseup', function(evt) {
    dragging = false;
  });

  $('button').click(function(evt) {
    if(evt.target.id !== 'clear') {
      color = evt.target.id;
    }
    else {
      var ctx = canvas[0].getContext('2d');
      $scope.clearData();
    }
  });

  whiteboardService.$on('value', function(snapshot) {
    $scope.clear();
    if(snapshot !== undefined) {
      angular.forEach(snapshot.snapshot.value, function(circle) {
        var ctx = canvas[0].getContext('2d');
        ctx.beginPath();
        ctx.fillStyle = circle.color;
        ctx.arc(circle.x,circle.y,5,0,2*Math.PI);
        ctx.fill();
      });
    }
  });
}

app.controller('WhiteboardController', ['$scope', '$firebase', 'whiteboardService', fn]);