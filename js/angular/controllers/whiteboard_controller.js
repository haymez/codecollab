/*
 * Controller for whiteboard
 */

function fn($scope, $firebase, whiteboardService) {
  var canvas = $('#canvas');
  var x;
  var y;

  $scope.lineType = 'lineMode';
  $scope.lineTypes = ['dotMode', 'lineMode'];
  $scope.$watch('lineType', function() {
    dotMode = $scope.lineType.indexOf('dotMode') >= 0
  });
  
  $scope.color = 'black';
  $scope.colors = ['black', 'red', 'blue', 'green', 'brown', 'purple', 'white'];
  $scope.$watch('color', function() {
    color = $scope.color;
  });

  $scope.lineSize = 'Medium';
  $scope.lineSizes = ['Small', 'Medium', 'Large', 'Extra Large'];
  $scope.$watch('lineSize', function() {
    if($scope.lineSize.indexOf('Small') >= 0)
      lineSize = 2;
    else if($scope.lineSize.indexOf('Medium') >= 0)
      lineSize = 5;
    else if($scope.lineSize.indexOf('Large') >= 0 && $scope.lineSize.indexOf('Extra') == -1)
      lineSize = 10;
    else if($scope.lineSize.indexOf('Extra') >= 0)
      lineSize = 20;
  });

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
      whiteboardService.$add({
        x: x, y: y,
        color: color,
        lineSize: lineSize,
        last: !dragging,
        uniqueID: uniqueID
      });
    }
  }).on('vmouseup', function(evt) {
    evt.preventDefault();
    x = Math.round((evt.clientX - canvas.offset().left) / xScale);
    y = Math.round(((evt.clientY - canvas.offset().top) / yScale) + scrollValue);
    whiteboardService.$add({
        x: x, y: y,
        color: color,
        lineSize: lineSize,
        last: true,
        uniqueID: uniqueID
      });
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
        if(dotMode) {
          ctx.beginPath();
          ctx.fillStyle = circle.color;
          ctx.arc(circle.x,circle.y,5,0,2*Math.PI);
          ctx.fill();          
        } else {
          ctx.strokeStyle = circle.color;
          ctx.lineJoin = "round";
          ctx.lineWidth = circle.lineSize;
          ctx.beginPath();
          if(prevCircle !== null && !prevCircle.last && circle.uniqueID == prevCircle.uniqueID) {
            ctx.moveTo(prevCircle.x, prevCircle.y);
          } else {
            ctx.moveTo(circle.x-1, circle.y)
          }
          ctx.lineTo(circle.x, circle.y);
          ctx.closePath();
          ctx.stroke();
          prevCircle = circle;
        }
        
      });
    }
  });
}

app.controller('WhiteboardController', ['$scope', '$firebase', 'whiteboardService', fn]);