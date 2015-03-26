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
    
    gravity: 2, //Z px/second/second
    defaultMass: 5, //default mass

    Body: function (type, x, y, size, xV, yV, friction, color, mass, draggable) { //create new entities
        /*
            type is in allowedTypes
            x, y, and size can be any #
            xV and yV default to 0 but are #s
            color is hex or rgba, defaults to black
            mass is # but defaults to 5
            draggable is bool, defaults to false
        */
        allowedTypes = ['circle', 'square']; //radius, side length, 
        mass = mass || cel.defaultMass;
        draggable = draggable || false;
        color = color || '#000000';
        xV = xV || 0;
        yV = yV || 0;
        friction = friction || 0.98;

        if (allowedTypes.indexOf(type) == -1) {
            type = 'circle';
        }

        this.type = type;
        this.x = x;
        this.y = y;
        this.size = size;
        this.mass = mass;  //yes, mass will make things fall faster (or 0 if not at all)...
        this.draggable = draggable;
        this.color = color;
        this.friction = friction;
        
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
            this.yV = Math.sin(dir) * vel;
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
            this.yV += Math.sin(dir) * vel;
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

        //cel.bodies.push(this);
    },

    updateAll: function (ctx, arr) { //update with regard to context
        for (var i = 0; i < arr.length; i++) {
            arr[i].update(ctx);
        }
    },

    clear: function (canvas, ctx) {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

};