var Toy = function(element, data){
	data = data || {}
	this.data = {
		velX: data.velX || 0,
		velY: data.velY || 0,
		spinner: 'spinner' in data ? data.spinner : false,
		movable: 'movable' in data ? data.movable : true,
		autospin: 'autospin' in data ? data.autospin : false,
		blink: 'blink' in data ? data.blink : false,
		bow: 'bow' in data ? data.bow : false,
		gravity: {
			enabled: 'gravity' in data ? data.gravity.enabled : false,
			force: 'gravity' in data ? data.gravity.force : 0.1,
			barrier: 'gravity' in data ? data.gravity.barrier : true
		}
	};
	this.x = data.x || Math.random()*window.innerWidth * 0.9;
	this.y = data.y || Math.random()*window.innerHeight * 0.9;
	this.rot = 0;
	this.velRot = 0;
	this.velX = this.data.velX || 0;
	this.velY = this.data.velY || 0;
	this.width = 128;
	this.height = 128;
	this.display = "block";
	this.element = element;
	this.moving = false;
	if(this.data.movable) {
		this.element.addEventListener('touchstart', this.click.bind(this));
		this.element.addEventListener('mousedown', this.click.bind(this));
		this.element.addEventListener('touchend', this.unclick.bind(this));
		this.element.addEventListener('mouseup', this.unclick.bind(this));
	} else {
		this.element.addEventListener('touchstart', function(e){e.preventDefault()});
		this.element.addEventListener('mousedown', function(e){e.preventDefault()});
		this.element.addEventListener('touchend', function(e){e.preventDefault()});
		this.element.addEventListener('mouseup', function(e){e.preventDefault()});
	}
	if(this.data.spinner) {
		var spin = function(e){e.preventDefault();if(this.data.movable){(this.click(e))};this.velRot+=2;}.bind(this);
		this.element.addEventListener('touchstart', spin);
		this.element.addEventListener('mousedown', spin);
		this.element.addEventListener('touchend', this.unclick.bind(this));
		this.element.addEventListener('mouseup', this.unclick.bind(this));
	}
	if(this.data.bow) {
		var shoot = function(e){e.preventDefault();if(this.data.movable){(this.click(e))};var elem=document.createElement("IMG");elem.src="arrow.png";document.body.append(elem);toys.push(new Toy(elem, {x: this.x - this.width * 0.6, y: this.y - this.height * 0.6, velX: -Math.random()*12-6, velY: -Math.random()*8-8, movable: false, gravity: {enabled: true, force: 0.75, barrier: false}}))}.bind(this);
		this.element.addEventListener('touchstart', shoot);
		this.element.addEventListener('mousedown', shoot);
		this.element.addEventListener('touchend', this.unclick.bind(this));
		this.element.addEventListener('mouseup', this.unclick.bind(this));
	}
	if(this.data.blink) {
		var blink = function(e){e.preventDefault();if(this.data.movable){(this.click(e))};this.element.src=this.element.src.replace(/2/g,"").replace('.png','2.png')}.bind(this);
		this.element.addEventListener('touchstart', blink);
		this.element.addEventListener('mousedown', blink);
		this.element.addEventListener('touchend', this.unclick.bind(this));
		this.element.addEventListener('mouseup', this.unclick.bind(this));
	}
	if(this.data.autospin) {
		this.velRot = -8;
	};
	this.element.addEventListener('mousemove', function(e){e.preventDefault();window.onmousemove(e);})
	this.element.addEventListener('touchmove', function(e){e.preventDefault();window.ontouchmove(e);})
};
Toy.prototype.update = function(){
	this.element.style.display = this.display;
	this.element.style.position = "absolute";
	this.element.style.left = (this.x+=(this.velX*=0.985)) + "px";
	this.element.style.top = (this.y+=(this.moving?0:this.velY)) + "px";
	this.element.style.width = this.width + "px";
	this.element.style.height = this.height + "px";
	this.element.style.WebkitTransform = "rotate("+(this.rot+=(this.velRot)*=((this.moving||this.data.autospin)?1:0.998))+"deg)";
	this.element.style.msTransform = "rotate("+(this.rot+=(this.velRot)*=((this.moving||this.data.autospin)?1:0.998))+"deg)";
	this.element.style.transform = "rotate("+(this.rot+=(this.velRot)*=((this.moving||this.data.autospin)?1:0.998))+"deg)";
	if(this.data.gravity.enabled && this.y < window.innerHeight * 0.95 && !this.moving) this.velY += this.data.gravity.force;
	if(this.y > window.innerHeight * 0.9 && !(this.moving)) this.velY = (this.data.gravity.barrier==true?-1:1)*Math.abs(this.velY * 0.85);
};
Toy.prototype.click = function(e){
	e.preventDefault();
	this.paddingX = e.pageX - this.x;
	this.paddingY = e.pageY - this.y;
	this.moving = true;
};
Toy.prototype.unclick = function(e){
	this.moving = false;
	this.element.src=this.element.src.replace(/2/g, '');
};



var toys = [];
var e = document.getElementsByTagName('img');
var update = function(){
	for (var i = toys.length - 1; i >= 0; i--) {
		toys[i].update();
	};
	requestAnimationFrame(update);
};
window.onload = function(){
	for(var i = 0; i < e.length; i ++) {
		var c = (e[i].getAttribute("class") || "");
		options = {x: 16, y: (i-0.75) * 136 + 1};
		if(c.includes("spinner")) options.spinner = true;
		if(c.includes("gravity")) options.gravity = true;
		if(c.includes("blink")) options.blink = true;
		if(c.includes("autospin")) options.autospin = true;
		if(c.includes("flower")) options.movable = false;
		if(c.includes("flower")) options.y = window.innerHeight - 128;
		if(c.includes("bow")) options.bow = true;
		toys.push(new Toy(e[i], options));
	}
	var a = MatterJS();
	document.getElementById('addMoreShapes').onclick = a.add;
	setTimeout(update);
};
window.onmousemove = function(e){
	e.preventDefault();
	for (var i = toys.length - 1; i >= 0; i--) {
		if(toys[i].moving==true) toys[i].x = e.pageX-toys[i].paddingX;
		if(toys[i].moving==true) toys[i].y = e.pageY-toys[i].paddingY;
	};
};
window.ontouchmove = function(e){
	e.preventDefault();
	for (var i = toys.length - 1; i >= 0; i--) {
		if(toys[i].moving==true) toys[i].x = e.pageX-toys[i].paddingX;
		if(toys[i].moving==true) toys[i].y = e.pageY-toys[i].paddingY;
	};
};



MatterJS = function() {
    var width = window.innerWidth * 0.3,
    	height = window.innerHeight * 0.3;
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Composites = Matter.Composites,
        Common = Matter.Common,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        World = Matter.World,
        Bodies = Matter.Bodies;
    var engine = Engine.create(),
        world = engine.world;
    var render = Render.create({
        element: document.getElementById('shapeland'),
        engine: engine,
        options: {
            width: width,
            height: height,
            showAngleIndicator: false,
            wireframes: false
        }
    });
    Render.run(render);
    var runner = Runner.create();
    Runner.run(runner, engine);
    var stack = function(){return Composites.stack(20, 20, 5/*x amount*/, 1/*y amount*/, 0, 0, function(x, y) {
        var sides = Math.round(Common.random(1, 8));
        sides = (sides === 3) ? 4 : sides;
        var chamfer = null;
        if (sides > 2 && Common.random() > 0.7) {
            chamfer = {
                radius: 10
            };
        }
        switch (Math.round(Common.random(0, 1))) {
        case 0:
            if (Common.random() < 0.8) {
                return Bodies.rectangle(x*2, y, Common.random(20,25), Common.random(20,25), { chamfer: chamfer });
            } else {
                return Bodies.rectangle(x, y, Common.random(30,35), Common.random(30,35), { chamfer: chamfer });
            }
        case 1:
            return Bodies.polygon(x, y, sides, Common.random(15,30), { chamfer: chamfer });
        }
    })};
    World.add(world, stack());
    World.add(world, [
        Bodies.rectangle(width/2, height, width*0.75, 50, { isStatic: true, render: {fillStyle: "#09F"} }),
        Bodies.rectangle(width*(1/8), height-25, 25, 50, { isStatic: true, render: {fillStyle: "#09F"} }),
        Bodies.rectangle(width*(7/8), height-25, 25, 50, { isStatic: true, render: {fillStyle: "#09F"} })
    ]);
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.3,
                render: {
                    visible: false
                }
            }
        });
    World.add(world, mouseConstraint);
    render.mouse = mouse;
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: width, y: height }
    });
    var add = (function(){
    	World.add(world,stack());
    	document.getElementById("addMoreShapes").style.position="absolute";
    	document.getElementById("addMoreShapes").style.display="none";
    	setTimeout(function(){
    		document.getElementById("addMoreShapes").style.display="block";
    		document.getElementById("addMoreShapes").style.position="absolute";
    	},5000)
    });
    return {
        engine: engine,
        runner: runner,
        render: render,
        canvas: render.canvas,
        stop: function() {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
        },
        add: add
    };
};
