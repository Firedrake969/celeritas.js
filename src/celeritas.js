/*==============================================================*\
	
	Firedrake969 2015
    
\*==============================================================*/

document.addEventListener("keydown", function (e) {
    cel.keys[e.which] = true;
	console.log(cel.keys);
});

document.addEventListener("keyup", function (e) {
    delete cel.keys[e.which];
	console.log(cel.keys);
});

cel = {

    keys: {}, //for keypresses

    gravity: 9.8, //Z px/second/second - not added
    defaultMass: 1, //default mass
    defaultFriction: 0.9,
    
    dist: function(x, y, x0, y0) {
        return Math.sqrt((x -= x0) * x + (y -= y0) * y);
    },

    Body: function (properties) { //create new entities
        /*
            required:
				type
				x
				y
				size (or height and width if rectangle) (radius for circles)
        */
        allowedTypes = ['circle', 'square', 'rectangle', 'rect'];

        if (allowedTypes.indexOf(properties.type) == -1) {
            type = 'circle';
        }

        this.type = properties.type;
        this.x = properties.x;
        this.y = properties.y;
        if (properties.type == 'rectangle' || properties.type == 'rect') {
            this.height = properties.height;
            this.width = properties.width;
        } else {
            this.size = properties.size;
        }
        this.mass = properties.mass || cel.defaultMass; //yes, mass will make things fall faster (or 0 if not at all)...
        this.draggable = properties.draggable || false;
        this.color = properties.color || '#000000';
        this.friction = properties.friction || cel.defaultFriction;
        this.xV = properties.xV || 0;
        this.yV = properties.yV || 0;

        this.setLinearVelocity = function (xV, yV) {
            this.xV = xV;
            this.yV = yV;
        };

        this.setAngularVelocity = function (vel, dir, degrees) { //expects in radians - set third arg to true if not
            degrees = degrees || false;
            if (degrees) { //safeguard against someone using degrees
                dir = Math.PI / 180;
            }
            this.xV = Math.cos(dir) * vel;
            this.yV = -Math.sin(dir) * vel;
        };

        this.applyLinearForce = function (xV, yV) {
            this.xV += xV;
            this.yV += yV;
        };

        this.applyAngularForce = function (vel, dir, degrees) { //similar to setAngularVel
            degrees = degrees || false;
            if (degrees) { //safeguard against someone using degrees
                dir = Math.PI / 180;
            }

            this.xV += Math.cos(dir) * vel;
            this.yV += -Math.sin(dir) * vel;
        },
            
        this.isTouching = function(other) {
            function circleCollide(obj1, obj2) {  //obj1 is unknown, obj2 is a circle
                switch(obj1.type) {  //obj1 is the case
                    case 'circle':
                        if (cel.dist(obj1.x, obj1.y, obj2.x, obj2.y) <= obj1.size + obj2.size) {
                            return true;
                        } else {
                            return false;
                        }
                        break;
                    case 'square':  //http://stackoverflow.com/questions/21089959/detecting-collision-of-rectangle-with-circle-in-html5-canvas
                        var distX = Math.abs(obj2.x - obj1.x);
                        var distY = Math.abs(obj2.y - obj1.y);
                    
                        if (distX > (obj1.size/2 + obj2.size)) { return false; }
                        if (distY > (obj1.size/2 + obj2.size)) { return false; }
                    
                        if (distX <= (obj1.size/2)) { return true; } 
                        if (distY <= (obj1.size/2)) { return true; }
                    
                        var dx=distX-obj1.size/2;
                        var dy=distY-obj1.size/2;
                        return (dx*dx+dy*dy<=(obj2.size * obj2.size));
						
                    case 'rect':  //let it fall through to synonym
                        case 'rectangle':
							var distX = Math.abs(obj2.x - obj1.x);
							var distY = Math.abs(obj2.y - obj1.y);
						
							if (distX > (obj1.width/2 + obj2.size)) { return false; }
							if (distY > (obj1.height/2 + obj2.size)) { return false; }
						
							if (distX <= (obj1.width/2)) { return true; } 
							if (distY <= (obj1.height/2)) { return true; }
						
							var dx=distX-obj1.width/2;
							var dy=distY-obj1.height/2;
							return (dx*dx+dy*dy<=(obj2.size * obj2.size));
                    default:
                        break;
                }
            }
			
			function squareCollide(obj1, obj2) {  //obj1 is unknown, obj2 is square
                switch(obj1.type) {
                    case "circle":
                        var distX = Math.abs(obj1.x - obj2.x);
                        var distY = Math.abs(obj1.y - obj2.y);
                    
                        if (distX > (obj2.size/2 + obj1.size)) { return false; }
                        if (distY > (obj2.size/2 + obj1.size)) { return false; }
                    
                        if (distX <= (obj2.size/2)) { return true; } 
                        if (distY <= (obj2.size/2)) { return true; }
                    
                        var dx=distX-obj2.size/2;
                        var dy=distY-obj2.size/2;
                        return (dx*dx+dy*dy<=(obj1.size * obj1.size));
                    case "square":  //http://stackoverflow.com/questions/8017541/javascript-canvas-collision-detection
						var x1 = obj1.x;
						var x2 = obj2.x;
						var y1 = obj1.y;
						var y2 = obj2.y;
						var size1 = obj1.size/2;
						var size2 = obj2.size/2;
						
						var bottom1, bottom2, left1, left2, right1, right2, top1, top2;
						left1 = x1 - size1;
						right1 = x1 + size1;
						top1 = y1 - size1;
						bottom1 = y1 + size1;
						left2 = x2 - size2;
						right2 = x2 + size2;
						top2 = y2 - size2;
						bottom2 = y2 + size2;
						return !(left1 > right2 || left2 > right1 || top1 > bottom2 || top2 > bottom1);
                    case "rectangle":
                        case "rect":  //let it fall through
							var x1 = obj1.x;
							var x2 = obj2.x;
							var y1 = obj1.y;
							var y2 = obj2.y;
							var height1 = obj1.height/2;
							var height2 = obj2.size/2;
							var width1 = obj1.width/2;
							var width2 = obj2.size/2;
							
							var bottom1, bottom2, left1, left2, right1, right2, top1, top2;
							left1 = x1 - width1;
							right1 = x1 + width1;
							top1 = y1 - height1;
							bottom1 = y1 + height1;
							left2 = x2 - width2;
							right2 = x2 + width2;
							top2 = y2 - height2;
							bottom2 = y2 + height2;
							return !(left1 > right2 || left2 > right1 || top1 > bottom2 || top2 > bottom1);
                }
            }
			
			//note for squareCollide - maybe be the same as rectCollide but pass obj1.height/width as obj1.size or whatever?
			//consider this...
			//first finish both methods though
            
            switch(other.type) {
                case 'circle':
                    return circleCollide(this, other);
                case 'square':
                    return squareCollide(this, other);
                case 'rect':  //let it fall through to synonym
                    case 'rectangle':
                        return rectCollide(this, other);
                default:
                    return 'error';
            }
        },
            
        this.draw = function (ctx) {
            ctx.fillStyle = this.color;
            switch (this.type) {
                case 'circle':
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.closePath();
                    break;
                case 'square':
                    ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
                    break;
                case 'rect':
                case 'rectangle':
                    ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
                    break;
                default:
                    //nothing
            }
        };

        this.update = function (ctx) {
            this.draw(ctx);
            this.x += this.xV;
            this.y += this.yV;
            this.yV *= this.friction;
            this.xV *= this.friction;
            this.yV += this.mass * cel.gravity * 0.1;
        };

    },

    updateAll: function (ctx, arr) { //update all bodies in an array with regard to context
        for (var i = 0; i < arr.length; i++) {
            arr[i].update(ctx);
        }
    },

    clear: function (canvas, ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

};