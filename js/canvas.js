/*
 * Handles some logic for canvas
 */

// Global variables
var color = 'black';
var lineSize = 5;
var page = $(window);
var canvas = $("#canvas");
var dragging = false;
var xScale = 1;
var yScale = 1;
var scrollValue = 0;
var dotMode = true;
var uniqueID;

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
  redraw(canvas, ctx);
}

function redraw(canvas, ctx) {
  var boardRef = new Firebase('https://codecollab.firebaseio.com/collaborations/collab1/whiteboard/data');
  boardRef.push({test: 'hey'});
}

$(document).ready(function() {
  uniqueID = Math.floor(Math.random()*10000);
  resize();
});

page.resize(function() {
  resize();
});

canvas.on('vmousedown', function(evt) {
  dragging = true;
}).on('vmouseup', function(evt) {
  dragging = false;
});

$(document).on('scroll', function(evt) {
  scrollValue = $(this).scrollTop();
})

function getDistance(x, y, x2, y2) {
  var X = x2-x;
  var Y = y2-y;
  return Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2));
}