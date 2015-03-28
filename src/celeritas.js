/*==============================================================*\
	
	Firedrake969 2015

\*==============================================================*/

/*
    Script expectations:
    
    jQuery  (only needed for keypresses)
    
    canvas = document.getElementById('id of your canvas');
    ctx = canvas.getContext('2d'); (ctx is context)
    
    some sort of array to store bodies in (not required)
*/

$(document).keydown(function (e) {
    cel.keys[e.which] = true;
});

$(document).keyup(function (e) {
    delete cel.keys[e.which];
});

cel = {

    keys: {}, //for keypresses
    
    gravity: 2, //Z px/second/second - not added
    defaultMass: 5, //default mass
	defaultFriction: 0.9,

    Body: function (properties) { //create new entities
        /*
            required:
				type
				x
				y
				size (or height and width if rectangle)
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
        this.mass = properties.mass || cel.defaultMass;  //yes, mass will make things fall faster (or 0 if not at all)...
        this.draggable = properties.draggable || false;
        this.color = properties.color || '#000000';
        this.friction = properties.friction || cel.defaultFriction;
		this.xV = properties.xV || 0;
		this.yV = properties.yV || 0;
        
        this.setLinearVelocity = function(xV, yV) {
            this.xV = xV;
            this.yV = yV;
        }
        
        this.setAngularVelocity = function(vel, dir, degrees) {  //expects in radians - set third arg to true if not
            degrees = degrees || false;
            if (degrees) {  //safeguard against someone using degrees
                dir = Math.PI/180;
            }
            this.xV = Math.cos(dir) * vel;
            this.yV = -Math.sin(dir) * vel;
        }
        
        this.applyLinearForce = function(xV, yV) {
            this.xV += xV;
            this.yV += yV;
        }
        
        this.applyAngularForce = function(vel, dir, degrees) {  //similar to setAngularVel
            degrees = degrees || false;
            if (degrees) {  //safeguard against someone using degrees
                dir = Math.PI/180;
            }
            
            this.xV += Math.cos(dir) * vel;
            this.yV += -Math.sin(dir) * vel;
        },
            
        this.update = function(ctx) {
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
                default:
                    //nothing
            }
            this.x += this.xV;
            this.y += this.yV;
            this.yV *= this.friction;
            this.xV *= this.friction;
        }
		
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