var ThomasScript = {

	init : function( tw )
	{
		var me = this;

		var size = 10;
        var step = 1;

        var gridHelper = new THREE.GridHelper( size, step );
        tw.scenes.main.add( gridHelper );
                
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        this.tw = tw;
        
        var geometry = new THREE.Geometry();
        var material = new THREE.LineBasicMaterial({
            color: 0xff0000,
            linewidth: 5
        });
        
        // 100 = nombre max de points
        for (i = 0; i < 100; i++){
            geometry.vertices.push(new THREE.Vector3(0, 0, 0));
        }
        
        this.line = new THREE.Line(geometry, material);
        // pourquoi ?
        this.line.geometry.dynamic = true;

        tw.scenes.main.add(this.line);  
        
        var geometryPlane = new THREE.PlaneGeometry( 20, 20, 32 );
        var materialPlane = new THREE.MeshBasicMaterial( {color: 0x777777, side: THREE.DoubleSide} );
        var plane = new THREE.Mesh( geometryPlane, materialPlane );
        
        //plane.rotation.x = 2;
        plane.rotation.x = Math.PI / 2;
        plane.position.y = - 0.1;
        this.plane = plane;   
        tw.scenes.main.add( plane );
        
        console.log(tw);

        tw.container[0].addEventListener( 'mousedown', 
        	function(e) {

        		me.onMouseDown(e, me);
        	},
        false );
	},

	update : function ( tw , deltaTime )
	{
		

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
                //console.log(intersects[ i ]);
                
                //this.GuillaumeScctxript.line.geometry.vertices.push(new THREE.Vector3(intersects[ i ].point.x, intersects[ i ].point.y, intersects[ i ].point.z));
                
                ctx.line.geometry.vertices.push(ctx.line.geometry.vertices.shift()); //shift the array
                ctx.line.geometry.vertices[100 - 1] = new THREE.Vector3(intersects[ i ].point.x, 0, intersects[ i ].point.z); //add the point to the end of the array
                ctx.line.geometry.verticesNeedUpdate = true;

                /*
                var geometry = new THREE.BoxGeometry(1,1,1);
                var material = new THREE.MeshBasicMaterial({color:0x00ff20});
                var cube = new THREE.Mesh(geometry,material);
                cube.position.x = intersects[ i ].point.x;
                cube.position.y = intersects[ i ].point.y;
                cube.position.z = intersects[ i ].point.z;
                this.GuillaumeScript.tw.scenes.main.add(cube); 
                */
                
                break;
            }
        }
    },

	curveCornerCutting : function ()
	{

	},

	inputs : {
		'a' : function (me, tw)
		{
			console.log(me);
		}
	}
}