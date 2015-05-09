canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');

var ball1 = new cel.Body({
    x: 25,
    y: 25,
    size:15,
    //mass:0,
    type: 'circle'
});

var ball2 = new cel.Body({
    x: 30,
    y: 250,
    size:15,
    mass:0,
    type: 'square'
});

var touching = false;

setInterval(function () {
    if (!touching) {
        touching = ball1.isTouching(ball2);
        cel.clear(canvas, ctx);
        ball1.update(ctx);
        ball2.update(ctx);
        ball1.y += 1;
        ball2.y -= 1;
     
}, 10);
setTimeout(function () {
    console.log(ball1, ball2);
}, 1000);

/*var ball = new cel.Body({
    x: 25,
    y: 25,
    height: 25,
    width: 10,
    type: 'rect',
    xV: 10,
    yV: 5
});
console.log(ball);
setInterval(function () {
    cel.clear(canvas, ctx);
    ball.update(ctx);
}, 10);
setTimeout(function () {
    console.log(ball);
    ball.applyLinearForce(5, 5);
}, 1000);*/