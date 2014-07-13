/*
 * Controller for whiteboard
 */

function fn($scope, $firebase, whiteboardService) {
  var color = 'black';
  var lineSize = 5;
  var page = $(window);
  var canvas = $("#canvas");
  var dragging = false;
  var currentSnapshot;
  var xScale = 1;
  var yScale = 1;
  var scrollValue = 0;
  var dotMode = true;
  var uniqueID;
  var x;
  var y;

  $scope.lineType = 'lineMode';
  $scope.lineTypes = ['dotMode', 'lineMode'];

  $scope.color = 'black';
  $scope.colors = ['black', 'red', 'blue', 'green', 'brown', 'purple', 'white'];

  $scope.lineSize = 'Medium';
  $scope.lineSizes = ['Small', 'Medium', 'Large', 'Extra Large'];

  $scope.$watch('lineType', function() {
    dotMode = $scope.lineType.indexOf('dotMode') >= 0
  });

  $scope.$watch('color', function() {
    color = $scope.color;
  });
  
  $scope.$watch('lineType', function() {
    drawLines(null);
  });

  $scope.$watch('lineSize', function() {
    if($scope.lineSize.indexOf('Small') >= 0) lineSize = 2;
    else if($scope.lineSize.indexOf('Medium') >= 0) lineSize = 5;
    else if($scope.lineSize.indexOf('Large') >= 0 && $scope.lineSize.indexOf('Extra') == -1)
      lineSize = 10;
    else if($scope.lineSize.indexOf('Extra') >= 0) lineSize = 20;
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
    var currentSnapshot = snapshot;
    drawLines(snapshot);
  });

  var drawLines = function(snapshot) {
    if(snapshot != null)
      currentSnapshot = snapshot;
    $scope.clear();
    var finished = [];
    if(currentSnapshot === undefined) return;
    angular.forEach(currentSnapshot.snapshot.value, function(parentCircle) {
      if(finished.indexOf(parentCircle.uniqueID) === -1) {
        finished.push(parentCircle.uniqueID);
        var currID = parentCircle.uniqueID;
        var prevCircle = null;
        angular.forEach(currentSnapshot.snapshot.value, function(circle) {
          if(currID === circle.uniqueID) {
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
            }
            prevCircle = circle;
          }
        });
      }
    });
  }

  function resize() {
    var ctx = canvas[0].getContext('2d');
    var xOffset = 0;
    var yOffset = 0;
    xScale = 1;
    yScale = 1;
    var oldWidth = ctx.canvas.width;
    var oldHeight = ctx.canvas.height;

    // Canvas is too big
    if(ctx.canvas.width > page.width()) {
      xOffset = page.width() - ctx.canvas.width;
      ctx.canvas.width = page.width();
      xScale = 800/(800-xOffset);
    }
    if(ctx.canvas.height > page.height()) {
      yOffset = page.height() - ctx.canvas.height;
      ctx.canvas.height = page.height();
      yScale = 500/(500-yOffset);
    }
    ctx.canvas.height += yOffset;

    // Canvas is too small
    if(ctx.canvas.width < page.width()) {
      if(page.width() < 800)
        ctx.canvas.width = page.width();
      else
        ctx.canvas.width = 800;
    }
    if(ctx.canvas.height < page.height()) {
      if(page.height() < 500)
        ctx.canvas.height = page.height();
      else
        ctx.canvas.height = 500;
    }
    

    // Re-scale canvas
    xScale = ctx.canvas.width / 800;
    yScale = ctx.canvas.height / 500;
    ctx.scale(xScale, yScale);

    // Redraw canvas
    drawLines(null);
  }

  //Listeners
  canvas.on('vmousedown', function(evt) {
    dragging = true;
  }).on('vmouseup', function(evt) {
    dragging = false;
  });

  $(document).on('scroll', function(evt) {
    scrollValue = $(this).scrollTop();
  })

  $(document).ready(function() {
    uniqueID = Math.floor(Math.random()*10000);
    resize();
  });

  page.resize(function() {
    resize();
  });

}


app.controller('WhiteboardController', ['$scope', '$firebase', 'whiteboardService', fn]);