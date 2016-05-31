var ThreeWrapper = function (data){
	this.inject(data);
}
ThreeWrapper.prototype  = {
	// Camera attributes
	MAX_Z : 5000,
	VIEW_ANGLE : 45,
	NEAR : 1,
	FAR : 10000,
	CAMERA_Z : 50,
	//
	paused : false,
	entitiesSpeedFactor : 1,
	entitiesManager : null,
	inject : function(data){
		var me = this;

		this.evaluateMode = false;

		this.size = data.size || {width : 800, height : 600};
		this.imagePlaneSize = data.imagePlaneSize || {width : 800, height : 600};
		this.paused = data.paused || false;

		this.container = $('<div style="width:' + this.size.width + 'px;height:' + this.size.height + 'px;">');
		
		this.orbitContainer = data.orbitContainer;

		this.aspect = this.size.width / this.size.height;
		this.scenes = {};
		this.cameras = {};
		this.scripts = data.scripts;

		
		/*
			MouseWheel listener
		*/
		// FireFox case
		$(this.container).bind("DOMMouseScroll",function (e) {
			var factor = e.ctrlKey ? 50 : 5;

			var fake = new THREE.Vector3(1,1,1),
				vec = fake.subVectors(
						new THREE.Vector3(0,0,0),
						me.cameras.main.position
					);

			// UP
			if (e.originalEvent.detail && e.originalEvent.detail <= 0)
			{
		    	if(me.cameras.main){
		    		me.cameras.main.position.add(vec.normalize().multiply(new THREE.Vector3(factor,factor,factor)));
		    	}
		    }
		    // Down
		    else {
		    	if(me.cameras.main){
		    		me.cameras.main.position.add(vec.normalize().multiply(new THREE.Vector3(-factor,-factor,-factor)));
		    	}
		    }

		   	
		   	e.stopPropagation();
		   	e.preventDefault();
		   	return false;

		});

	

		// Others
		$(this.container).bind("mousewheel",function (e) {
			var factor = e.ctrlKey ? 50 : 5;

			var fake = new THREE.Vector3(1,1,1),
				vec = fake.subVectors(
						new THREE.Vector3(0,0,0),
						me.cameras.main.position
					);

			// UP
			if (e.originalEvent.wheelDelta && e.originalEvent.wheelDelta >= 0){
		        if(me.cameras.main){
		    		me.cameras.main.position.add(vec.normalize().multiply(new THREE.Vector3(factor,factor,factor)));
		    	}
		    }
		    // Down
		    else {
		    	if(me.cameras.main){
		    		me.cameras.main.position.add(vec.normalize().multiply(new THREE.Vector3(-factor,-factor,-factor)));
		    	}
		    }

		   	e.stopPropagation();
		   	e.preventDefault();
		   	return false;
		});

		data.container.append(this.container);

		this.initThree();
	},
	initThree : function(){
		THREE.ImageUtils.crossOrigin = "anonymous"; 

		this.renderer = new THREE.WebGLRenderer();

		this.cameras.main = new THREE.PerspectiveCamera(
			this.VIEW_ANGLE,
			this.aspect,
			this.NEAR,
			this.FAR
		);

		this.scenes.main = new THREE.Scene();


		var controls = new THREE.OrbitControls( this.cameras.main , this.orbitContainer || document);


		this.scenes.main.add(this.cameras.main);

		this.cameras.main.position.z = this.CAMERA_Z;

		this.renderer.setSize(this.size.width, this.size.height);

		this.container.append(this.renderer.domElement);

		this.pointLight = new THREE.PointLight(0xFFFFFF);

		// set its position
		this.pointLight.position.x = 0;
		this.pointLight.position.y = 0;
		this.pointLight.position.z = 1000;

		
		// add to the scene
		this.scenes.main.add(this.pointLight);

		for (var i = 0; i < this.scripts.length; ++i)
		{
			this.scripts[i].init(this);
		}

		this.cameras.CURRENT = this.cameras.main;
		this.scenes.CURRENT = this.scenes.main;
		
	},
	// Doesnt work with negative range .. (as -10 -> 10).
	getRandomPositionInRect : function(rect, z){
		return new THREE.Vector3(
			Math.floor(Math.random() * (rect.topLeft.x - rect.bottomRight.x + 1)) + rect.topLeft.x,
			Math.floor(Math.random() * (rect.bottomRight.y - rect.topLeft.y + 1)) + rect.bottomRight.y,
			z
		);
	},
	changeCamera : function(camera){
		this.cameras.CURRENT = camera;
	},
	// TO USE
	changeFramerate : function(time){
		var me = this;
		me.stop();
		me.start();
	},
	speedUp : function(){
		this.entitiesSpeedFactor *=2 ;
	},
	slowDown : function(){
		this.entitiesSpeedFactor /= 2;
	},
	pause : function(){
		if (this.paused){
			this.start();
		}
		else {
			this.stop();
		}
	},
	start : function(){
		this.paused = false;
		this.render();
	},
	stop : function(){
		this.paused = true;
	},
	render: function(){
		var me = this,
			fakeVector = new THREE.Vector3(0,0,0);

		var clock = new THREE.Clock();
		function run () {

			if(me.paused)
				return;

			requestAnimationFrame(run);
			
			for (var i = 0; i < me.scripts.length; ++i)
			{
				if (me.scripts[i].update)
				{
					me.scripts[i].update(me, clock.getDelta());
				}
			}

			me.renderer.render(me.scenes.CURRENT, me.cameras.CURRENT);
		}

		run();
	}

}