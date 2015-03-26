canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');

var ball = new cel.Body(
	{
		x:25,
		y:25,
		size:25,
		type:'circle',
		xV:5,
		yV:2.5
	}
);

console.log(ball);

setInterval(function() {
	cel.clear(canvas, ctx);
	ball.update(ctx);
}, 10);
setTimeout(function() {
	console.log(ball);
	ball.applyLinearForce(5, 5);
}, 1000);
