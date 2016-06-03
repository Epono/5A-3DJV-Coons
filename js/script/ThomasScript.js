var ThomasScript = {

	DEFAULT_V : 0.25,
	DEFAULT_U : 0.25,
	//@Override
	init : function( tw )
	{
		var me = this;

		console.info("** ThomasScript how to use : **");
		console.info("left click + shift : set a point.");

		/* General */
		this.tw = tw;

		// Grid
		var gridHelper = new THREE.GridHelper( 
			10, 
			1
		);

        this.tw.scenes.main.add( gridHelper );

        // Plane
        var geometryPlane = new THREE.PlaneGeometry( 20, 20, 32 );
        var materialPlane = new THREE.MeshBasicMaterial( {color: 0xFFFFFF, side: THREE.DoubleSide} );
        var plane = new THREE.Mesh( geometryPlane, materialPlane );
        
        plane.rotation.x = Math.PI / 2;
        plane.position.y = - 0.1;

        this.plane = plane;

        this.tw.scenes.main.add( plane );


		/* CurveCornerCutting  */
		this.u = ThomasScript.DEFAULT_U;
		this.v = ThomasScript.DEFAULT_V;

		/* CurveCornerCutting Interface */
		this.MAX_LINE_VERTICES = 10;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.lineMaterial = new THREE.LineBasicMaterial({
            color: 0x0000FF,
        });
      	
      	/* Kobbelt */
      	var cubeSize = 1,
      		customCubeVertices = [
	      		new Vertex( -1 * cubeSize, 1 * cubeSize, 1 * cubeSize ),
				new Vertex(  1 * cubeSize, 1 * cubeSize, 1 * cubeSize ),
				new Vertex(  1 * cubeSize, 1 * cubeSize,-1 * cubeSize ),
				new Vertex( -1 * cubeSize, 1 * cubeSize,-1 * cubeSize ),

				new Vertex( -1 * cubeSize, -1 * cubeSize, 1 * cubeSize ),
				new Vertex(  1 * cubeSize, -1 * cubeSize, 1 * cubeSize ),
				new Vertex(  1 * cubeSize, -1 * cubeSize,-1 * cubeSize ),
				new Vertex( -1 * cubeSize, -1 * cubeSize,-1 * cubeSize )
	      	];

	    
	    var cubeMesh = new Mesh();

		cubeMesh.pushPolygoneAsVertices(
			[
				customCubeVertices[0],
				customCubeVertices[1],
				customCubeVertices[2],
				customCubeVertices[3]
			]
		);

		//tw.scenes.main.add(cubeMesh.buildThreeMesh());


		/**/
	    cubeMesh.pushPolygoneAsVertices(
			[
				customCubeVertices[1],
				customCubeVertices[5],
				customCubeVertices[6],
				customCubeVertices[2]
			]
		);

	    cubeMesh.pushPolygoneAsVertices(
			[
				customCubeVertices[0],
				customCubeVertices[4],
				customCubeVertices[5],
				customCubeVertices[1]
			]
		);

		cubeMesh.pushPolygoneAsVertices(
			[
				customCubeVertices[4],
				customCubeVertices[0],
				customCubeVertices[3],
				customCubeVertices[7]
			]
		);

		cubeMesh.pushPolygoneAsVertices(
			[
				customCubeVertices[5],
				customCubeVertices[4],
				customCubeVertices[7],
				customCubeVertices[6]
			]
		);

		cubeMesh.pushPolygoneAsVertices(
			[
				customCubeVertices[3],
				customCubeVertices[2],
				customCubeVertices[6],
				customCubeVertices[7]
			]
		);
		
		//cubeMesh.sortPolygoneVertice(cubeMesh.polygones[0]);

		var catmullClark = new CatmullClark(
			customCubeVertices, 
			cubeMesh.getEdges(), 
			cubeMesh.polygones
		);

		
		//var newPoly = catmullClark.launchCatmullClark();

		var generateCube = Mesh.getCubeMesh(5);		
	   // tw.scenes.main.add(generateCube.buildThreeMesh());

	    /*
	    var geometry = new THREE.Geometry();

		geometry.vertices.push(
			new THREE.Vector3( -1 * cubeSize, 1 * cubeSize, 1 * cubeSize ),
			new THREE.Vector3(  1 * cubeSize, 1 * cubeSize, 1 * cubeSize ),
			new THREE.Vector3(  1 * cubeSize, 1 * cubeSize,-1 * cubeSize ),
			new THREE.Vector3( -1 * cubeSize, 1 * cubeSize,-1 * cubeSize ),

			new THREE.Vector3( -1 * cubeSize, -1 * cubeSize, 1 * cubeSize ),
			new THREE.Vector3(  1 * cubeSize, -1 * cubeSize, 1 * cubeSize ),
			new THREE.Vector3(  1 * cubeSize, -1 * cubeSize,-1 * cubeSize ),
			new THREE.Vector3( -1 * cubeSize, -1 * cubeSize,-1 * cubeSize )
		);

		geometry.faces.push( 
			new THREE.Face3( 0, 2, 1 ),
			new THREE.Face3( 0, 3, 2 ),

			new THREE.Face3( 1, 6, 5 ),
			new THREE.Face3( 1, 2, 6 ),

			new THREE.Face3( 5, 7, 4 ),
			new THREE.Face3( 5, 6, 7 ),

			new THREE.Face3( 0, 4, 7 ),
			new THREE.Face3( 0, 7, 3 ),

			new THREE.Face3( 4, 0, 5 ),
			new THREE.Face3( 0, 1, 5 ),

			new THREE.Face3( 2, 3, 7 ),
			new THREE.Face3( 2, 7, 6 )
		);

		var cube = new THREE.Mesh( 
			geometry, 
			new THREE.MeshBasicMaterial( 
				{
					color: 0xFF33FF,
					side : THREE.BackSide,
					//side : THREE.DoubleSide
				} 
			)
		);
		
		tw.scenes.main.add(cube);
		*/

	    /* Mouse listener */
        this.tw.container[0].addEventListener( 'mousedown', 
        	function(e) {

        		if (e.button === 0 && e.shiftKey)
        			me.onMouseDown(e, me);

        	},
        false );
	},
	//@Override
	update : function ( tw , deltaTime )
	{
		if(this.line)
			this.line.geometry.verticesNeedUpdate = true;

	},
	//@Override
	inputs : {

		's' : function(me, tw)
		{
			var next = me.curveCornerCutting(me.line.geometry, true);
			me.setLine(next);
		},
		'c' : function(me, tw)
		{
			var next = me.curveCornerCutting(me.line.geometry, true);
			me.setLine(next);
		}
	},
	/*
	* Curve Corner Cutting
	*/
	upLine : function(nextCoor)
	{
		if (this.line)
		{
			this.tw.scenes.main.remove(this.line);

			var nextGeometry = new Geometry(),
			nextLineVertices = [];

			for (var i = 0; i < this.line.geometry.vertices.length; ++i)
			{
				nextLineVertices.push(this.line.geometry.vertices[i]);
			}

			nextLineVertices.push(nextCoor);

			nextGeometry.vertices = nextLineVertices;


			this.line = new THREE.Line(nextGeometry, this.lineMaterial);
		}
		else
		{
			var nextGeometry = new Geometry();

			nextGeometry.vertices.push(nextCoor);

			this.line = new THREE.Line(nextGeometry, this.lineMaterial);
		}

 		this.tw.scenes.main.add(this.line);
         
        
	},
	setLine : function(coors)
	{
		if (this.line)
		{
			this.tw.scenes.main.remove(this.line);
		}
		var nextGeometry = new Geometry();

		nextGeometry.vertices = coors;

		this.line = new THREE.Line(nextGeometry, this.lineMaterial);

		this.tw.scenes.main.add(this.line);
	},
	onMouseDown : function(event, ctx) 
    {
    	// calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        
        ctx.mouse.x = ( event.layerX / ctx.tw.size.width ) * 2 - 1;
        ctx.mouse.y = - ( event.layerY / ctx.tw.size.height ) * 2 + 1;	
        
        // update the picking ray with the camera and mouse position
        ctx.raycaster.setFromCamera( ctx.mouse, ctx.tw.cameras.CURRENT );	

        // calculate objects intersecting the picking ray
        var intersects = ctx.raycaster.intersectObjects( ctx.tw.scenes.main.children );


        for ( var i = 0; i < intersects.length; i++ ) {
            if(intersects[ i ].object == ctx.plane) {
            	

            	ctx.upLine( new THREE.Vector3(intersects[ i ].point.x, 0.1, intersects[ i ].point.z));
              	
                break;
            }
        }
    },
	curveCornerCutting : function (geometry, close=false)
	{ 
		var nextLineGeometry = [],
			first = true,
			vec0 = new THREE.Vector3(0,0,0);

		this.u = this.u ? this.u : ThomasScript.bugMode ? 0 : ThomasScript.DEFAULT_U;
		this.v = this.v ? this.v : ThomasScript.bugMode ? 0 : ThomasScript.DEFAULT_V;

        for (var i = 0; i + 1< geometry.vertices.length; ++i)
        {
    	
			var p1 = geometry.vertices[i],
    			p2 = geometry.vertices[i+1];

    		var vecDir = p2.clone().sub(p1);

    		
    		var nextP1 = p1.clone().add(
    				new THREE.Vector3(
        				vecDir.x * this.u,
        				vecDir.y * this.u,
        				vecDir.z * this.u
    				)
    			),
    			nextP2 = nextP1.clone().add(
    				vecDir.clone().multiplyScalar(
    					1 - (this.u + this.v)
    				)
    			);

			nextLineGeometry.push(nextP1);
			nextLineGeometry.push(nextP2);
        }

        if (close) {

			nextLineGeometry.push(nextLineGeometry[0]);
		}


        return nextLineGeometry;
	},
    
    curveCornerCuttingVertices : function (vertices, close = false)	{ 
		var nextLineGeometry = [], 
            first = true, 
            vec0 = new THREE.Vector3(0,0,0);

        this.u = this.u || ThomasScript.DEFAULT_U;
		this.v = this.v || ThomasScript.DEFAULT_V;
    
        for (var i = 0; i + 1< vertices.length; ++i) {
    	
			var p1 = vertices[i],
    			p2 = vertices[i+1];

    		var vecDir = p2.clone().sub(p1);

    		var nextP1 = p1.clone().add(
    				new THREE.Vector3(
        				vecDir.x * this.u,
        				vecDir.y * this.u,
        				vecDir.z * this.u
    				)
    			),
    			nextP2 = nextP1.clone().add(
    				vecDir.clone().multiplyScalar(
    					1 - (this.u + this.v)
    				)
    			);

			nextLineGeometry.push(nextP1);
			nextLineGeometry.push(nextP2);
        }

        if (close) {
			nextLineGeometry.push(nextLineGeometry[0]);
		}

        return nextLineGeometry;
	},

    /*
	* Kobbelt
	*/
	kobbelt : function()
	{

	},
	initCustomCube : function(data)
	{

	}
	
}

ThomasScript.bugMode = false;