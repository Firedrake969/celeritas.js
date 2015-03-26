$(function() {

canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');

var ball = new cel.Body('circle', 25, 25, 25);

ball.update(ctx);

});