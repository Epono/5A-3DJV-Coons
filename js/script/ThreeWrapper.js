var ThreeWrapper = function (data){
	this.inject(data);
}
ThreeWrapper.prototype  = {
	// Camera attributes
	MAX_Z : 5000,
	VIEW_ANGLE : 45,
	NEAR : 1,
	FAR : 10000,
	CAMERA_Z : 100,
	//
	paused : false,
	entitiesSpeedFactor : 1,
	entitiesManager : null,
	inject : function(data){
		var me = this;
		me.evaluateMode = false;

		me.size = data.size || {width : 800, height : 600};
		me.imagePlaneSize = data.imagePlaneSize || {width : 800, height : 600};
		me.paused = data.paused || false;

		me.container = $('<div style="width:' + me.size.width + 'px;height:' + me.size.height + 'px;">');
		
		me.orbitContainer = data.orbitContainer;

		me.aspect = me.size.width / me.size.height;
		me.scenes = {};
		me.cameras = {};


		
		/*
			MouseWheel listener
		*/
		// FireFox case
		$(me.container).bind("DOMMouseScroll",function (e) {
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
		$(me.container).bind("mousewheel",function (e) {
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

		data.container.append(me.container);

		me.initThree();
	},
	initThree : function(){
		var me = this;
		THREE.ImageUtils.crossOrigin = "anonymous"; 

		me.renderer = new THREE.WebGLRenderer();

		me.cameras.main = new THREE.PerspectiveCamera(
			me.VIEW_ANGLE,
			me.aspect,
			me.NEAR,
			me.FAR
		);

		me.scenes.main = new THREE.Scene();


		var controls = new THREE.OrbitControls( me.cameras.main , me.orbitContainer || document);


		me.scenes.main.add(me.cameras.main);

		me.cameras.main.position.z = me.CAMERA_Z;

		me.renderer.setSize(me.size.width, me.size.height);

		me.container.append(me.renderer.domElement);

		var pointLight = new THREE.PointLight(0xFFFFFF);

		// set its position
		pointLight.position.x = 0;
		pointLight.position.y = 0;
		pointLight.position.z = 3000;

		//me.scenes.main.add(pointLight);
        
        var geometry = new THREE.BoxGeometry(1,1,1);

        var material = new THREE.MeshBasicMaterial({color:0x00ff20});

        var cube = new THREE.Mesh(geometry,material);

        console.log(cube.rotation);

        me.scenes.main.add(cube);  
        
         var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(-10, 0, 0));
        geometry.vertices.push(new THREE.Vector3(0, 10, 0));
        geometry.vertices.push(new THREE.Vector3(10, 0, 0));
        


        var line = new THREE.Line(geometry, material);

        me.scenes.main.add(line);  
        
        var size = 10;
        var step = 1;

        var gridHelper = new THREE.GridHelper( size, step );
        me.scenes.main.add( gridHelper );

		// add to the scene
		me.scenes.main.add(pointLight);
	},
	// Doesnt work with negative range .. (as -10 -> 10).
	getRandomPositionInRect : function(rect, z){
		return new THREE.Vector3(
			Math.floor(Math.random() * (rect.topLeft.x - rect.bottomRight.x + 1)) + rect.topLeft.x,
			Math.floor(Math.random() * (rect.bottomRight.y - rect.topLeft.y + 1)) + rect.bottomRight.y,
			z
		);
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

			//me.delta = clock.getDelta();

			if(me.paused)
				return;

			requestAnimationFrame(run);

			me.renderer.render(me.scenes.main, me.cameras.main);
		}

		run();
	}

}