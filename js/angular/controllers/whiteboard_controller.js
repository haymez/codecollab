/*
 * Controller for whiteboard
 */

function fn($scope, $firebase, whiteboardService) {
  // whiteboardService.$bind($scope, 'data');
  var canvas = $('#canvas');
  var x;
  var y;

  $scope.clear = function() {
    var ctx = canvas[0].getContext('2d');
    ctx.clearRect (0, 0, 800, 500);
  }

  $scope.clearData = function() {
    whiteboardService.$set("");
  }

  canvas.on('vmousemove', function(evt) {
    evt.preventDefault();
    x = Math.round((evt.clientX - canvas.offset().left) / xScale);
    y = Math.round(((evt.clientY - canvas.offset().top) / yScale) + scrollValue);
    if(dragging) {
      whiteboardService.$add({x: x, y: y, color: color, last: !dragging});
    }
  }).on('vmouseup', function(evt) {
    evt.preventDefault();
    x = Math.round((evt.clientX - canvas.offset().left) / xScale);
    y = Math.round(((evt.clientY - canvas.offset().top) / yScale) + scrollValue);
    whiteboardService.$add({x: x, y: y, color: color, last: true});
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
      var prevCircle = null;
      angular.forEach(snapshot.snapshot.value, function(circle) {
        var ctx = canvas[0].getContext('2d');
        // ctx.beginPath();
        // ctx.fillStyle = circle.color;
        // ctx.arc(circle.x,circle.y,5,0,2*Math.PI);
        // ctx.fill();
        
        ctx.strokeStyle = circle.color;
        ctx.lineJoin = "round";
        ctx.lineWidth = 5;
        ctx.beginPath();
        if(prevCircle !== null && !prevCircle.last) {
          ctx.moveTo(prevCircle.x, prevCircle.y);
        } else {
          ctx.moveTo(circle.x-1, circle.y)
        }
        ctx.lineTo(circle.x, circle.y);
        ctx.closePath();
        ctx.stroke();
        prevCircle = circle;
      });
    }
  });
}

app.controller('WhiteboardController', ['$scope', '$firebase', 'whiteboardService', fn]);