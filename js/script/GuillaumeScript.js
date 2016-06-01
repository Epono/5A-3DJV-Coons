var GuillaumeScript = {
	init : function(tw)
	{    
        var size = 10;
        var step = 1;

        var gridHelper = new THREE.GridHelper(size, step);
        tw.scenes.main.add(gridHelper);
        
        var geometryPlane = new THREE.PlaneGeometry(20, 20, 32);
        var materialPlane = new THREE.MeshBasicMaterial( {color: 0x777777, side: THREE.DoubleSide} );
        var plane = new THREE.Mesh( geometryPlane, materialPlane );
        plane.rotation.x = Math.PI / 2;
        //plane.position.y = - 0.1;
        tw.scenes.main.add(plane);
                
        var numberOfPoints = 21;
        
        // Devant
        var geometryCurve1 = new THREE.Geometry();
        for(var i = 0; i < numberOfPoints; ++i) {
            geometryCurve1.vertices.push(new THREE.Vector3(-10 + i, 5 + Math.sqrt(i), 10));
        }

        //Derrière
        var geometryCurve2 = new THREE.Geometry();
        for(var i = 0; i < numberOfPoints; ++i) {
            geometryCurve2.vertices.push(new THREE.Vector3(-10 + i, 10 - Math.sqrt(i), -10));
        }
        
        // Gauche
        var geometryCurve3 = new THREE.Geometry();
        geometryCurve3.vertices.push(new THREE.Vector3(geometryCurve1.vertices[0].x, geometryCurve1.vertices[0].y, geometryCurve1.vertices[0].z));
        for(var i = 1; i < numberOfPoints - 1; ++i) {
            geometryCurve3.vertices.push(new THREE.Vector3(-10, 5 + Math.sqrt(i), 10 - i));
        }
        geometryCurve3.vertices.push(new THREE.Vector3(geometryCurve2.vertices[0].x, geometryCurve2.vertices[0].y, geometryCurve2.vertices[0].z));
        
        // Droite
        var geometryCurve4 = new THREE.Geometry();
        geometryCurve4.vertices.push(new THREE.Vector3(geometryCurve1.vertices[numberOfPoints - 1].x, geometryCurve1.vertices[numberOfPoints - 1].y, geometryCurve1.vertices[numberOfPoints - 1].z));
        for(var i = 1; i < numberOfPoints - 1; ++i) {
            geometryCurve4.vertices.push(new THREE.Vector3(10, 10 - Math.sqrt(i), 10 - i));
        }
        geometryCurve4.vertices.push(new THREE.Vector3(geometryCurve2.vertices[numberOfPoints - 1].x, geometryCurve2.vertices[numberOfPoints - 1].y, geometryCurve2.vertices[numberOfPoints - 1].z));

        var materialFrontBack = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        var materialLeftRight = new THREE.MeshBasicMaterial( {color: 0x0000ff} );

        var verticesCurve1 = ThomasScript.curveCornerCutting(geometryCurve1, false);
        var verticesCurve2 = ThomasScript.curveCornerCutting(geometryCurve2, false);
        var verticesCurve3 = ThomasScript.curveCornerCutting(geometryCurve3, false);
        var verticesCurve4 = ThomasScript.curveCornerCutting(geometryCurve4, false);
                
        var firstGeometryCurve1 = geometryCurve1.vertices[0];
        var lastGeometryCurve1 = geometryCurve1.vertices[geometryCurve1.vertices.length - 1];
        
        var firstGeometryCurve2 = geometryCurve2.vertices[0];
        var lastGeometryCurve2 = geometryCurve2.vertices[geometryCurve2.vertices.length - 1];
        
        var firstGeometryCurve3 = geometryCurve3.vertices[0];
        var lastGeometryCurve3 = geometryCurve3.vertices[geometryCurve3.vertices.length - 1];
        
        var firstGeometryCurve4 = geometryCurve4.vertices[0];
        var lastGeometryCurve4 = geometryCurve4.vertices[geometryCurve4.vertices.length - 1];
        
        geometryCurve1 = new THREE.Geometry();
        geometryCurve2 = new THREE.Geometry();
        geometryCurve3 = new THREE.Geometry();
        geometryCurve4 = new THREE.Geometry();
        
        geometryCurve1.vertices.push(firstGeometryCurve1);
        for(var i = 0; i < verticesCurve1.length; ++i) {
            geometryCurve1.vertices.push(verticesCurve1[i]);
        }
        geometryCurve1.vertices.push(lastGeometryCurve1);
        
        geometryCurve2.vertices.push(firstGeometryCurve2);
        for(var i = 0; i < verticesCurve2.length; ++i) {
            geometryCurve2.vertices.push(verticesCurve2[i]);
        }
        geometryCurve2.vertices.push(lastGeometryCurve2);
                
        geometryCurve3.vertices.push(firstGeometryCurve3);
        for(var i = 0; i < verticesCurve3.length; ++i) {
            geometryCurve3.vertices.push(verticesCurve3[i]);
        }
        geometryCurve3.vertices.push(lastGeometryCurve3);
        
        geometryCurve4.vertices.push(firstGeometryCurve4);
        for(var i = 0; i < verticesCurve4.length; ++i) {
            geometryCurve4.vertices.push(verticesCurve4[i]);
        }
        geometryCurve4.vertices.push(lastGeometryCurve4);
        
        tw.scenes.main.add(new THREE.Line(geometryCurve1, materialFrontBack));  
        tw.scenes.main.add(new THREE.Line(geometryCurve2, materialFrontBack));
        tw.scenes.main.add(new THREE.Line(geometryCurve3, materialLeftRight));
        tw.scenes.main.add(new THREE.Line(geometryCurve4, materialLeftRight));
        
        // PLAN entre devant/derrière
        var verticesPlaneFrontBack = this.computeSurfaceReglee(geometryCurve1.vertices, geometryCurve2.vertices);
        
        // PLAN entre gauche/droite
        var verticesPlaneLeftRight = this.computeSurfaceReglee(geometryCurve3.vertices, geometryCurve4.vertices)

        var geometryPoint = new THREE.SphereGeometry( 0.1, 0.1, 0.1 );
        
        // POINTS ROUGE (front/back)
        this.verticesFrontBack = [];
        for(var i = 0; i < verticesPlaneFrontBack.length; ++i) {
            var point = new THREE.Mesh( geometryPoint, materialFrontBack );
            point.visible = false;
            point.position.x = verticesPlaneFrontBack[i].x;
            point.position.y = verticesPlaneFrontBack[i].y;
            point.position.z = verticesPlaneFrontBack[i].z;
            tw.scenes.main.add( point );
            this.verticesFrontBack.push(point);
        }  
        
        // POINTS BLEU (left/right)
        this.verticesLeftRight = [];
        for(var i = 0; i < verticesPlaneLeftRight.length; ++i) {
            var point = new THREE.Mesh( geometryPoint, materialLeftRight );
            point.visible = false;
            point.position.x = verticesPlaneLeftRight[i].x;
            point.position.y = verticesPlaneLeftRight[i].y;
            point.position.z = verticesPlaneLeftRight[i].z;
            tw.scenes.main.add( point );
            this.verticesLeftRight.push(point);
        }
                
        var verticesBoth = this.computeFacetteDeCoons(geometryCurve1.vertices, geometryCurve2.vertices, verticesPlaneFrontBack, verticesPlaneLeftRight);
        
        var materialBoth = new THREE.MeshBasicMaterial( {color: 0xff0000, side: THREE.DoubleSide} );

        this.myVerticesBoth = [];
        for(var i = 0; i < verticesBoth.length; ++i) {
            var point = new THREE.Mesh( geometryPoint, materialBoth );
            point.visible = false;
            point.position.x = verticesBoth[i].x;
            point.position.y = verticesBoth[i].y;
            point.position.z = verticesBoth[i].z;
            tw.scenes.main.add( point );
            this.myVerticesBoth.push(point);
        }
        
        var geometryFacetteDeCoons = new THREE.Geometry();
        geometryFacetteDeCoons.vertices = verticesBoth;
        
        var triangles = this.computeTriangles(verticesBoth, numberOfPoints * 2);
        
        // DEFINITION DU MATERIEL UTILISE PAR LES FACETTES
        var materialFacette = new THREE.MeshPhongMaterial( { color: 0xff00ff, specular: 0x009900, shininess: 30, shading: THREE.FlatShading, side : THREE.DoubleSide} )
        
        for( var i = 0; i < triangles.length; i+=3 ){
            geometryFacetteDeCoons.faces.push( new THREE.Face3( triangles[i], triangles[i+1], triangles[i+2] ));
        }
        
        // AFFICHAGE DE LA FACETTE
        var facetteDeCoons = new THREE.Mesh( geometryFacetteDeCoons, materialFacette );
        this.facetteDeCoons = facetteDeCoons;
        tw.scenes.main.add(facetteDeCoons);
        
        // REPERE
        this.drawRepere(tw);
    },

	update : function ( tw , deltaTime )
	{

    },
    
    inputs : {
		'A' : function (me, tw)
		{
            // Points front/back
            for(var i = 0; i < me.verticesFrontBack.length; ++i) {
                me.verticesFrontBack[i].visible = !me.verticesFrontBack[i].visible;
            } 
        }, 
        'Z' : function(me, tw) {
            // Points left/right
            for(var i = 0; i < me.verticesLeftRight.length; ++i) {
                me.verticesLeftRight[i].visible = !me.verticesLeftRight[i].visible;
            } 
        }, 
        'E' : function(me, tw) {
            // Points facette
            for(var i = 0; i < me.myVerticesBoth.length; ++i) {
                me.myVerticesBoth[i].visible = !me.myVerticesBoth[i].visible;
            } 
        },
        'R' : function(me, tw) {
            // Toggle affichage facettes
            me.facetteDeCoons.visible = !me.facetteDeCoons.visible;
        },
	},
    
    drawRepere : function(tw) {
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
    
    computeSurfaceReglee : function(verticesCurve1, verticesCurve2) {
        var verticiesLength = verticesCurve1.length;
        var verticesSurfaceReglee = [];
        
        for(var t = 0; t < verticiesLength; ++t) {
            var tt = t / (verticiesLength - 1);
            for(var s = 0; s < verticiesLength; ++s) {
                var ss = s / (verticiesLength - 1);
                var vertice = new THREE.Vector3((1 - tt) * verticesCurve1[s].x + tt * verticesCurve2[s].x,
                                                (1 - tt) * verticesCurve1[s].y + tt * verticesCurve2[s].y, 
                                                (1 - tt) * verticesCurve1[s].z + tt * verticesCurve2[s].z);
                verticesSurfaceReglee.push(vertice);
            }
        }
        
        return verticesSurfaceReglee;
    },
    
    computeFacetteDeCoons : function(verticesCurve1, verticesCurve2, verticesPlaneFrontBack, verticesPlaneLeftRight) {
        var verticiesLength = verticesCurve1.length;
        var verticesFacetteDeCoons = [];
        
        for(var t = 0; t < verticiesLength; ++t) {
            var tt = t / (verticiesLength - 1);
            for(var s = 0; s < verticiesLength; ++s) {
                var ss = s / (verticiesLength - 1);
                
                var bst = new THREE.Vector3(
                    verticesCurve1[0].x * (1 - ss) * (1 - tt) + verticesCurve1[verticiesLength - 1].x * ss * (1 - tt) + verticesCurve2[0].x * (1 - ss) * tt + verticesCurve2[verticiesLength - 1].x * ss * tt, 
                    verticesCurve1[0].y * (1 - ss) * (1 - tt) + verticesCurve1[verticiesLength - 1].y * ss * (1 - tt) + verticesCurve2[0].y * (1 - ss) * tt + verticesCurve2[verticiesLength - 1].y * ss * tt, 
                    verticesCurve1[0].z * (1 - ss) * (1 - tt) + verticesCurve1[verticiesLength - 1].z * ss * (1 - tt) + verticesCurve2[0].z * (1 - ss) * tt + verticesCurve2[verticiesLength - 1].z * ss * tt);
                
                var vertice = new THREE.Vector3(verticesPlaneFrontBack[verticiesLength * t + s].x + verticesPlaneLeftRight[verticiesLength * s + t].x - bst.x, 
                                                verticesPlaneFrontBack[verticiesLength * t + s].y + verticesPlaneLeftRight[verticiesLength * s + t].y - bst.y, 
                                                verticesPlaneFrontBack[verticiesLength * t + s].z + verticesPlaneLeftRight[verticiesLength * s + t].z - bst.z);
                
                verticesFacetteDeCoons.push(vertice);
            }
        }
        
        return verticesFacetteDeCoons;
    },
    
    computeTriangles : function(vertices, length) {
        var triangles = [];
        
        for(var i = 0; i < vertices.length - length; i++) {
            triangles.push(i);
            triangles.push(i + 1);
            triangles.push(i + length);
            
            triangles.push(i + 1);
            triangles.push(i + length);
            triangles.push(i + length + 1);

            if(i % length == length - 2) {
                i++;
            }
        }  
        
        return triangles;
    },
}