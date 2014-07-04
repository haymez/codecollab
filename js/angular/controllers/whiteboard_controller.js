/*
 * Controller for whiteboard
 */

function fn($scope, $firebase, whiteboardService) {
  whiteboardService.$bind($scope, 'data');
}

app.controller('WhiteboardController', ['$scope', '$firebase', 'whiteboardService', fn]);