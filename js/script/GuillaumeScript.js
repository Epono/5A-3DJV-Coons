var GuillaumeScript = {

	init : function( tw )
	{
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
        
        tw.container[0].addEventListener( 'mousedown', GuillaumeScript.onMouseDown, false );
        
        this.points = [];
        
        var materialCurves = new THREE.LineBasicMaterial({
            color: 0x007777
        });
        
        // Devant
        var geometryCurve1 = new THREE.Geometry();
        for(var i = 0; i < 21; ++i) {
            geometryCurve1.vertices.push(new THREE.Vector3(-10 + i, 5 + Math.random(), 10));
        }

        //Derrière
        var geometryCurve2 = new THREE.Geometry();
        for(var i = 0; i < 21; ++i) {
            geometryCurve2.vertices.push(new THREE.Vector3(-10 + i, 5 + Math.random(), -10));
        }
        
        // Gauche
        var geometryCurve3 = new THREE.Geometry();
        geometryCurve3.vertices.push(new THREE.Vector3(geometryCurve1.vertices[0].x, geometryCurve1.vertices[0].y, geometryCurve1.vertices[0].z));
        for(var i = 1; i < 20; ++i) {
            geometryCurve3.vertices.push(new THREE.Vector3(-10, 5 + Math.random(), 10 - i));
        }
        geometryCurve3.vertices.push(new THREE.Vector3(geometryCurve2.vertices[0].x, geometryCurve2.vertices[0].y, geometryCurve2.vertices[0].z));
        
        // Droite
        var geometryCurve4 = new THREE.Geometry();
        geometryCurve4.vertices.push(new THREE.Vector3(geometryCurve1.vertices[20].x, geometryCurve1.vertices[20].y, geometryCurve1.vertices[20].z));
        for(var i = 1; i < 20; ++i) {
            geometryCurve4.vertices.push(new THREE.Vector3(10, 5 + Math.random(), 10 - i));
        }
        geometryCurve4.vertices.push(new THREE.Vector3(geometryCurve2.vertices[20].x, geometryCurve2.vertices[20].y, geometryCurve2.vertices[20].z));

        var materialFrontBack = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        var materialLeftRight = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
        
        tw.scenes.main.add(new THREE.Line(geometryCurve1, materialFrontBack));  
        tw.scenes.main.add(new THREE.Line(geometryCurve2, materialFrontBack));  
        tw.scenes.main.add(new THREE.Line(geometryCurve3, materialLeftRight));  
        tw.scenes.main.add(new THREE.Line(geometryCurve4, materialLeftRight));  
        
        // PLAN entre devant/derrière
        var verticesPlaneFrontBack = [];
        for(var t = 0; t < 21; ++t) {
            var tt = t / 20;
            for(var s = 0; s < 21; ++s) {
                var ss = s / 20;
                var vertice = new THREE.Vector3((1 - tt) * geometryCurve1.vertices[s].x + tt * geometryCurve2.vertices[s].x,
                                                (1 - tt) * geometryCurve1.vertices[s].y + tt * geometryCurve2.vertices[s].y, 
                                                (1 - tt) * geometryCurve1.vertices[s].z + tt * geometryCurve2.vertices[s].z);
                verticesPlaneFrontBack.push(vertice);
            }
        }
        
        // PLAN entre gauche/droite
        var verticesPlaneLeftRight = [];
        for(var t = 0; t < 21; ++t) {
            var tt = t / 20;
            for(var s = 0; s < 21; ++s) {
                var ss = s / 20;
                var vertice = new THREE.Vector3((1 - tt) * geometryCurve3.vertices[s].x + tt * geometryCurve4.vertices[s].x,
                                                (1 - tt) * geometryCurve3.vertices[s].y + tt * geometryCurve4.vertices[s].y, 
                                                (1 - tt) * geometryCurve3.vertices[s].z + tt * geometryCurve4.vertices[s].z);
                verticesPlaneLeftRight.push(vertice);
            }
        }
        /*
        var geometryMeshCurve1Curve2 = new THREE.Geometry();
        var materialPlaneCurves = new THREE.MeshBasicMaterial();
        
        var holes = [];
        var triangles, mesh;


        geometryMeshCurve1Curve2.vertices = verticesPlaneFrontBack;

        triangles = THREE.Shape.Utils.triangulateShape ( verticesPlaneFrontBack, holes );
        console.log(triangles);
          
        for( var i = 0; i < triangles.length; i++ ){
            geometryMeshCurve1Curve2.faces.push( new THREE.Face3( triangles[i][0], triangles[i][1], triangles[i][2] ));
        }   
        
        triangles = earcut(verticesPlaneFrontBack, holes, 3);
        console.log(triangles);
        
        for( var i = 0; i < triangles.length; i+=3 ){
            geometryMeshCurve1Curve2.faces.push( new THREE.Face3( triangles[i], triangles[i+1], triangles[i+2] ));
        }
        
        // tw.scenes.main.add(new THREE.Mesh( geometryMeshCurve1Curve2, materialPlaneCurves ));
        */
        
        var geometryPoint = new THREE.SphereGeometry( 0.1, 0.1, 0.1 );
        
        for(var i = 0; i < verticesPlaneFrontBack.length; ++i) {
            var point = new THREE.Mesh( geometryPoint, materialFrontBack );
            point.position.x = verticesPlaneFrontBack[i].x;
            point.position.y = verticesPlaneFrontBack[i].y;
            point.position.z = verticesPlaneFrontBack[i].z;
           //tw.scenes.main.add( point );
        }  
        
        for(var i = 0; i < verticesPlaneLeftRight.length; ++i) {
            var point = new THREE.Mesh( geometryPoint, materialLeftRight );
            point.position.x = verticesPlaneLeftRight[i].x;
            point.position.y = verticesPlaneLeftRight[i].y;
            point.position.z = verticesPlaneLeftRight[i].z;
            //tw.scenes.main.add( point );
        }
                
        var verticesBoth = [];
        for(var t = 0; t < 21; ++t) {
            var tt = t / 20;
            for(var s = 0; s < 21; ++s) {
                var ss = s / 20;
                
                var bst = new THREE.Vector3(
                    geometryCurve1.vertices[0].x * (1 - ss) * (1 - tt) + geometryCurve1.vertices[20].x * ss * (1 - tt) + geometryCurve2.vertices[0].x * (1 - ss) * tt + geometryCurve2.vertices[20].x * ss * tt, 
                    geometryCurve1.vertices[0].y * (1 - ss) * (1 - tt) + geometryCurve1.vertices[20].y * ss * (1 - tt) + geometryCurve2.vertices[0].y * (1 - ss) * tt + geometryCurve2.vertices[20].y * ss * tt, geometryCurve1.vertices[0].z * (1 - ss) * (1 - tt) + geometryCurve1.vertices[20].z * ss * (1 - tt) + geometryCurve2.vertices[0].z * (1 - ss) * tt + geometryCurve2.vertices[20].z * ss * tt);
                
                var vertice = new THREE.Vector3(verticesPlaneFrontBack[s + 21 * t].x + verticesPlaneLeftRight[s * 21 + t].x - bst.x, 
                                                verticesPlaneFrontBack[s + 21 * t].y + verticesPlaneLeftRight[s * 21 + t].y - bst.y, 
                                                verticesPlaneFrontBack[s + 21 * t].z + verticesPlaneLeftRight[s * 21 + t].z - bst.z);
                
                //console.log(bst);
                //console.log(verticesPlaneFrontBack[s + 21 * t]);
                //console.log(verticesPlaneLeftRight[s + 21 * t]);
                verticesBoth.push(vertice);
            }
        }
        
        var materialBoth = new THREE.MeshBasicMaterial( {color: 0xff0000, side: THREE.DoubleSide} );

        for(var i = 0; i < verticesBoth.length; ++i) {
            var point = new THREE.Mesh( geometryPoint, materialBoth );
            point.position.x = verticesBoth[i].x;
            point.position.y = verticesBoth[i].y;
            point.position.z = verticesBoth[i].z;
            tw.scenes.main.add( point );
        }
        
        var geometryFacetteDeCoons = new THREE.Geometry();
        
        var holes = [];
        var triangles, mesh;


        geometryFacetteDeCoons.vertices = verticesBoth;
        
        console.log(verticesBoth);

        /*
        triangles = THREE.Shape.Utils.triangulateShape ( verticesBoth, holes );
        console.log(triangles);
         
        for( var i = 0; i < triangles.length; i++ ){
            geometryFacetteDeCoons.faces.push( new THREE.Face3( triangles[i][0], triangles[i][1], triangles[i][2] ));
        }   
        */
        
        var verticesBothTemp = [];
        for(var i = 0; i < verticesBoth.length; ++i) {
            verticesBothTemp.push(verticesBoth[i].x);
            verticesBothTemp.push(verticesBoth[i].y);
            verticesBothTemp.push(verticesBoth[i].z);
        }
        triangles = earcut(verticesBothTemp, null, 3);
        console.log(triangles);
        
        triangles = [];
        for(var i = 0; i < verticesBoth.length - 21; i++) {
            triangles.push(i);
            triangles.push(i + 1);
            triangles.push(i + 21);
            
            triangles.push(i + 1);
            triangles.push(i + 22);
            triangles.push(i + 21);
            
            if(i % 21 == 19) {
                i++;
            }
        }
        
        var materialBoth = new THREE.MeshBasicMaterial( {color: 0xff0000, side: THREE.DoubleSide} );
        
        for( var i = 0; i < triangles.length; i+=3 ){
            geometryFacetteDeCoons.faces.push( new THREE.Face3( triangles[i], triangles[i+1], triangles[i+2] ));
        }

        tw.scenes.main.add(new THREE.Mesh( geometryFacetteDeCoons, materialBoth ));
        
        // REPERE
        var geometryRepere = new THREE.BoxGeometry( 4, 0.2, 0.2 );
        var materialRed = new THREE.MeshBasicMaterial( {color: 0xff0000} );
        var materialGreen = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        var materialBlue = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
        
        var cubeX = new THREE.Mesh( geometryRepere, materialRed );
        cubeX.position.x = 2;
        tw.scenes.main.add( cubeX );
               
        var cubeZ = new THREE.Mesh( geometryRepere, materialGreen );
        cubeZ.position.z = 2;
        cubeZ.rotation.y = 90 * Math.PI / 180;
        tw.scenes.main.add( cubeZ );
                
        var cubeY = new THREE.Mesh( geometryRepere, materialBlue );
        cubeY.position.y = 2;
        cubeY.rotation.z = 90 * Math.PI / 180;
        tw.scenes.main.add( cubeY );
    },

	update : function ( tw , deltaTime )
	{

    },
    
    inputs : {
		'p' : function (me, tw)
		{
			this.points = [];
            console.log(this);
		}
	},
    
    onMouseDown : function(event) 
    {
    	// calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        
        GuillaumeScript.mouse.x = ( event.layerX / GuillaumeScript.tw.size.width ) * 2 - 1;
        GuillaumeScript.mouse.y = - ( event.layerY / GuillaumeScript.tw.size.height ) * 2 + 1;	
        
        // update the picking ray with the camera and mouse position	
        GuillaumeScript.raycaster.setFromCamera( GuillaumeScript.mouse, GuillaumeScript.tw.cameras.main );	

        // calculate objects intersecting the picking ray
        var intersects = GuillaumeScript.raycaster.intersectObjects( GuillaumeScript.tw.scenes.main.children );

        for ( var i = 0; i < intersects.length; i++ ) {
            if(intersects[ i ].object == GuillaumeScript.plane) {
                //console.log(intersects[ i ]);
                
                //this.GuillaumeScript.line.geometry.vertices.push(new THREE.Vector3(intersects[ i ].point.x, intersects[ i ].point.y, intersects[ i ].point.z));
                
                GuillaumeScript.line.geometry.vertices.push(GuillaumeScript.line.geometry.vertices.shift()); //shift the array
                GuillaumeScript.line.geometry.vertices[100 - 1] = new THREE.Vector3(intersects[ i ].point.x, 0, intersects[ i ].point.z); //add the point to the end of the array
                GuillaumeScript.line.geometry.verticesNeedUpdate = true;

                /*
                var geometry = new THREE.BoxGeometry(1,1,1);
                var material = new THREE.MeshBasicMaterial({color:0x00ff20});
                var cube = new THREE.Mesh(geometry,material);
                cube.position.x = intersects[ i ].point.x;
                cube.position.y = intersects[ i ].point.y;
                cube.position.z = intersects[ i ].point.z;
                this.GuillaumeScript.tw.scenes.main.add(cube); 
                */
                
                GuillaumeScript.points.push(new THREE.Vector3(intersects[ i ].point.x, 0, intersects[ i ].point.z));
                console.log(GuillaumeScript.points);
                
                break;
            }
        }
    }
}

console.log(window);
//window.addEventListener( 'mousedown', GuillaumeScript.onMouseDown, false );