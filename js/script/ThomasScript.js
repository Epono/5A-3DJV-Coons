var ThomasScript = {

	init : function( tw )
	{
		console.info("** ThomasScript how to use : **");
		console.info("left click + shift : set a point.");

		var me = this;
		
		this.u = 0.25;
		this.v = 0.25;
		this.MAX_LINE_VERTICES = 10;


        var gridHelper = new THREE.GridHelper( 10, 1 );
        tw.scenes.main.add( gridHelper );
                

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        this.tw = tw;

        this.lineMaterial = new THREE.LineBasicMaterial({
            color: 0x0000FF,
        });
        
        this.currIndex = 0;
       
        
        

        var geometryPlane = new THREE.PlaneGeometry( 20, 20, 32 );
        var materialPlane = new THREE.MeshBasicMaterial( {color: 0x777777, side: THREE.DoubleSide} );
        var plane = new THREE.Mesh( geometryPlane, materialPlane );
        
        //plane.rotation.x = 2;
        plane.rotation.x = Math.PI / 2;
        plane.position.y = - 0.1;
        this.plane = plane;
        tw.scenes.main.add( plane );

        tw.container[0].addEventListener( 'mousedown', 
        	function(e) {

        		if (e.button === 0 && e.shiftKey)
        			me.onMouseDown(e, me);

        	},
        false );
	},

	update : function ( tw , deltaTime )
	{
		if(this.line)
			this.line.geometry.verticesNeedUpdate = true;

	},

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
        ctx.raycaster.setFromCamera( ctx.mouse, ctx.tw.cameras.main );	

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

	inputs : {

		's' : function(me, tw)
		{
			var next = me.curveCornerCutting(me.line.geometry, true);


			me.setLine(next);

			
		}
	}
}

