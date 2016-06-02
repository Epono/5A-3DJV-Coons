var GuillaumeScript = {
	init : function(tw)
	{    
        this.tw = tw;
        
        var size = 10;
        var step = 1;

        var gridHelper = new THREE.GridHelper(size, step);
        tw.scenes.main.add(gridHelper);
        
        var geometryPlane = new THREE.PlaneGeometry(20, 20, 32);
        var materialPlane = new THREE.MeshBasicMaterial( {color: 0x777777, side: THREE.DoubleSide} );
        var plane = new THREE.Mesh( geometryPlane, materialPlane );
        plane.rotation.x = Math.PI / 2;
        tw.scenes.main.add(plane);
           
        // REPERE
        this.drawRepere(tw);
        
        // COONS !
        this.pointsCurvesFrontBack = [];
        this.pointsCurvesLeftRight = [];
        
        this.pointsPlaneFrontBack = [];
        this.pointsPlaneLeftRight = [];
        this.pointsPlaneBoth = [];
        
        this.coonsPatches = [];
        //
        
        var numberOfPoints = 21;
        
        var inputData = this.getDebugCurves(numberOfPoints);
        var inputData2 = this.getDebugCurves2(numberOfPoints);
        var inputDataWing = this.getDebugCurvesWing(numberOfPoints);
        
        this.otherData = {
            materialFrontBack : new THREE.MeshBasicMaterial( {color: 0x00ff00} ),
            materialLeftRight : new THREE.MeshBasicMaterial( {color: 0x0000ff} ),
            materialBoth : new THREE.MeshBasicMaterial( {color: 0xff0000, side: THREE.DoubleSide} ),
            materialFacette : new THREE.MeshPhongMaterial( { color: 0xff00ff, specular: 0x009900, shininess: 30, shading: THREE.FlatShading, side : THREE.DoubleSide} ),

            geometryPoint : new THREE.SphereGeometry(0.1, 0.1, 0.1)
        };
        
        //this.drawFacetteDeCoons(inputData, this.otherData);
        //this.drawFacetteDeCoons(inputData2, this.otherData);
        //this.drawFacetteDeCoons(inputDataWing, this.otherData); 
        
        var numberOfPointsTerrain = 64;
        var terrain = new this.TerrainGeneration({
            width : numberOfPointsTerrain,
            height : numberOfPointsTerrain,
            segments : numberOfPointsTerrain,
            smoothingFactor : 32,
        });
        
        var verticesTerrain = [];
        for(var x = - numberOfPointsTerrain / 2; x < numberOfPointsTerrain / 2; x++) {
            for(var y = - numberOfPointsTerrain / 2; y < numberOfPointsTerrain / 2; y++) {
                verticesTerrain.push(new THREE.Vector3(x, terrain[numberOfPointsTerrain / 2 + x][numberOfPointsTerrain / 2 + y], y));
            }
        }
        
        
        var geometryPoint = new THREE.SphereGeometry(0.1, 0.1, 0.1);
        var materialFrontBack = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        /*
        for(var i = 0; i < verticesTerrain.length; ++i) {
            var point = new THREE.Mesh(geometryPoint, materialFrontBack);
            point.position.x = verticesTerrain[i].x;
            point.position.y = verticesTerrain[i].y;
            point.position.z = verticesTerrain[i].z;
            this.tw.scenes.main.add(point);
        }
        */
        
        var texture = THREE.ImageUtils.loadTexture('images/lucas_2.jpg', {}, function() {
            // Image loadé
        });
        
        var materialTerrain = new THREE.MeshPhongMaterial( { 
            color: 0xff00ff, 
            specular: 0x009900, 
            shininess: 30, 
            shading: THREE.FlatShading, 
            side : THREE.DoubleSide, 
            //map: texture
        });
        
        var geometryTerrain = new THREE.Geometry();
        geometryTerrain.vertices = verticesTerrain;
        
        var triangles = this.computeTriangles(verticesTerrain, numberOfPointsTerrain);
                
        for(var i = 0; i < triangles.length; i+=3){
            geometryTerrain.faces.push(new THREE.Face3(triangles[i], triangles[i+1], triangles[i+2]));
        }
        
        var meshTerrain = new THREE.Mesh(geometryTerrain, materialTerrain);
        console.log(geometryTerrain);
        tw.scenes.main.add(meshTerrain);
    },

	update : function ( tw , deltaTime )
	{

    },
    
    inputs : {
		'A' : function (me, tw)
		{
            // Points front/back
            for(var j = 0; j < me.pointsPlaneFrontBack.length; ++j) {
                for(var i = 0; i < me.pointsPlaneFrontBack[j].length; ++i) {
                    me.pointsPlaneFrontBack[j][i].visible = !me.pointsPlaneFrontBack[j][i].visible;
                }
            } 
            for(var i = 0; i < me.pointsCurvesFrontBack.length; ++i) {
                me.pointsCurvesFrontBack[i].visible = !me.pointsCurvesFrontBack[i].visible;
            } 
        }, 
        'Z' : function(me, tw) {
            // Points left/right
            for(var j = 0; j < me.pointsPlaneLeftRight.length; ++j) {
                for(var i = 0; i < me.pointsPlaneLeftRight[j].length; ++i) {
                    me.pointsPlaneLeftRight[j][i].visible = !me.pointsPlaneLeftRight[j][i].visible;
                } 
            }
            for(var i = 0; i < me.pointsCurvesLeftRight.length; ++i) {
                me.pointsCurvesLeftRight[i].visible = !me.pointsCurvesLeftRight[i].visible;
            } 
        }, 
        'E' : function(me, tw) {
            // Points facette
            var visible = false;
            for(var j = 0; j < me.pointsPlaneBoth.length; ++j) {
                for(var i = 0; i < me.pointsPlaneBoth[j].length; ++i) {
                    visible = !me.pointsPlaneBoth[j][i].visible;
                    me.pointsPlaneBoth[j][i].visible = !me.pointsPlaneBoth[j][i].visible;
                } 
            }
            
            for(var i = 0; i < me.pointsCurvesFrontBack.length; ++i) {
                me.pointsCurvesFrontBack[i].visible = visible;
            } 
            for(var i = 0; i < me.pointsCurvesLeftRight.length; ++i) {
                me.pointsCurvesLeftRight[i].visible = visible;
            }
        },
        'R' : function(me, tw) {
            // Toggle affichage facettes
            for(var i = 0; i < me.coonsPatches.length; ++i) {
                me.coonsPatches[i].visible = !me.coonsPatches[i].visible;
            }
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
        var verticesLength = verticesCurve1.length;
        var verticesSurfaceReglee = [];
        
        for(var t = 0; t < verticesLength; ++t) {
            var tt = t / (verticesLength - 1);
            for(var s = 0; s < verticesLength; ++s) {
                var ss = s / (verticesLength - 1);
                var vertice = new THREE.Vector3((1 - tt) * verticesCurve1[s].x + tt * verticesCurve2[s].x,
                                                (1 - tt) * verticesCurve1[s].y + tt * verticesCurve2[s].y, 
                                                (1 - tt) * verticesCurve1[s].z + tt * verticesCurve2[s].z);
                verticesSurfaceReglee.push(vertice);
            }
        }
        
        return verticesSurfaceReglee;
    },
    
    computeFacetteDeCoons : function(verticesCurve1, verticesCurve2, verticesPlaneFrontBack, verticesPlaneLeftRight) {
        var verticesLength = verticesCurve1.length;
        var verticesFacetteDeCoons = [];
        
        for(var t = 0; t < verticesLength; ++t) {
            var tt = t / (verticesLength - 1);
            for(var s = 0; s < verticesLength; ++s) {
                var ss = s / (verticesLength - 1);
                
                var bst = new THREE.Vector3(
                    verticesCurve1[0].x * (1 - ss) * (1 - tt) + verticesCurve1[verticesLength - 1].x * ss * (1 - tt) + verticesCurve2[0].x * (1 - ss) * tt + verticesCurve2[verticesLength - 1].x * ss * tt, 
                    verticesCurve1[0].y * (1 - ss) * (1 - tt) + verticesCurve1[verticesLength - 1].y * ss * (1 - tt) + verticesCurve2[0].y * (1 - ss) * tt + verticesCurve2[verticesLength - 1].y * ss * tt, 
                    verticesCurve1[0].z * (1 - ss) * (1 - tt) + verticesCurve1[verticesLength - 1].z * ss * (1 - tt) + verticesCurve2[0].z * (1 - ss) * tt + verticesCurve2[verticesLength - 1].z * ss * tt);
                
                var vertice = new THREE.Vector3(verticesPlaneFrontBack[verticesLength * t + s].x + verticesPlaneLeftRight[verticesLength * s + t].x - bst.x, 
                                                verticesPlaneFrontBack[verticesLength * t + s].y + verticesPlaneLeftRight[verticesLength * s + t].y - bst.y, 
                                                verticesPlaneFrontBack[verticesLength * t + s].z + verticesPlaneLeftRight[verticesLength * s + t].z - bst.z);
                
                verticesFacetteDeCoons.push(vertice);
            }
        }
        
        return verticesFacetteDeCoons;
    },
    
    getDebugCurves : function(numberOfPoints) {
        var curves = {
            numberOfPoints : numberOfPoints,
            verticesPolygonalChainFront : [],
            verticesPolygonalChainBack : [],
            verticesPolygonalChainLeft : [],
            verticesPolygonalChainRight : []
        };
        
        // Devant
        for(var i = 0; i < numberOfPoints; ++i) {
            curves.verticesPolygonalChainFront.push(new THREE.Vector3(-10 + i, 5 + Math.pow((i - numberOfPoints) / 10, 2), 10));
        }

        //Derrière
        for(var i = 0; i < numberOfPoints; ++i) {
            curves.verticesPolygonalChainBack.push(new THREE.Vector3(-10 + i, 10 - Math.pow((i - numberOfPoints) / 10, 2), -10));
        }
        
        // Gauche
        for(var i = 0; i < numberOfPoints; ++i) {
            curves.verticesPolygonalChainLeft.push(new THREE.Vector3(-10, 5 + Math.pow((i - numberOfPoints) / 10, 2), 10 - i));
        }
        
        // Droite
        for(var i = 0; i < numberOfPoints; ++i) {
           curves.verticesPolygonalChainRight.push(new THREE.Vector3(10, 10 - Math.pow((i - numberOfPoints) / 10, 2), 10 - i));
        }
        
        return curves;
    },
    
    getDebugCurves2 : function(numberOfPoints) {
        var curves = {
            numberOfPoints : numberOfPoints,
            verticesPolygonalChainFront : [],
            verticesPolygonalChainBack : [],
            verticesPolygonalChainLeft : [],
            verticesPolygonalChainRight : []
        };
        
        // Devant
        for(var i = 0; i < numberOfPoints; ++i) {
            curves.verticesPolygonalChainFront.push(new THREE.Vector3(10 + i, 10 - Math.pow((i - numberOfPoints) / 10, 2), 10));
        }

        //Derrière
        for(var i = 0; i < numberOfPoints; ++i) {
            curves.verticesPolygonalChainBack.push(new THREE.Vector3(10 + i, 5 + Math.pow((i - numberOfPoints) / 10, 2), -10));
        }
        
        // Gauche
        for(var i = 0; i < numberOfPoints; ++i) {
            curves.verticesPolygonalChainLeft.push(new THREE.Vector3(10,  10 - Math.pow((i - numberOfPoints) / 10, 2), 10 - i));
        }
        
        // Droite
        for(var i = 0; i < numberOfPoints; ++i) {
           curves.verticesPolygonalChainRight.push(new THREE.Vector3(30, 5 + Math.pow((i - numberOfPoints) / 10, 2), 10 - i));
        }
        
        return curves;
    },
    
    getDebugCurvesWing : function(numberOfPoints) {
        var curves = {
            numberOfPoints : numberOfPoints,
            verticesPolygonalChainFront : [],
            verticesPolygonalChainBack : [],
            verticesPolygonalChainLeft : [],
            verticesPolygonalChainRight : []
        };
        
        var width = 10;
        var width2 = 5;
        
        // Devant
        for(var i = 0; i < numberOfPoints; ++i) {
            var x = - width + i * (2*width / (numberOfPoints - 1));
            var value = Math.pow(width/2, 2) - Math.pow(Math.abs(x/2), 2);
            curves.verticesPolygonalChainFront.push(new THREE.Vector3((-width + i)/3, 2 + value, width*2));
        }

        //Derrière
        for(var i = 0; i < numberOfPoints; ++i) {
            var x = - width2 + i * (2*width2 / (numberOfPoints - 1));
            var value = Math.pow(width2/2, 2) - Math.pow(Math.abs(x/2), 2);
            curves.verticesPolygonalChainBack.push(new THREE.Vector3((-width + i)/3, 2 + value, -width*2));
        }
        
        // Gauche
        for(var i = 0; i < numberOfPoints; ++i) {
            curves.verticesPolygonalChainLeft.push(new THREE.Vector3(-width/3, 2, (width - i)*2));
        }
        
        // Droite
        for(var i = 0; i < numberOfPoints; ++i) {
           curves.verticesPolygonalChainRight.push(new THREE.Vector3(width/3, 2, (width - i)*2));
        }
        
        return curves;
    },
    
    computeTouteLaFacetteDeCoons : function(inputData) {
        /*
        data = {
            numberOfPoints : int,
            verticesPolygonalChainFront : [] THREE.Vector3,
            verticesPolygonalChainBack : [] THREE.Vector3,
            verticesPolygonalChainLeft : [] THREE.Vector3,
            verticesPolygonalChainRight : [] THREE.Vector3
        }
        */

        var facetteDeCoons = {
            numberOfPoints : inputData.numberOfPoints,
            
            verticesCurveFront : [],
            verticesCurveBack : [],
            verticesCurveLeft : [],
            verticesCurveRight : [],
            
            verticesPlaneFrontBack : [],
            verticesPlaneLeftRight : [],
            
            verticesPlaneBoth : []
        };
        
        var firstVerticePolygonalChainFront = inputData.verticesPolygonalChainFront[0];
        var lastVerticePolygonalChainFront = inputData.verticesPolygonalChainFront[inputData.numberOfPoints - 1];
        
        var firstVerticePolygonalChainBack = inputData.verticesPolygonalChainBack[0];
        var lastVerticePolygonalChainBack = inputData.verticesPolygonalChainBack[inputData.numberOfPoints - 1];
        
        var firstVerticePolygonalChainLeft = inputData.verticesPolygonalChainLeft[0];
        var lastVerticePolygonalChainLeft = inputData.verticesPolygonalChainLeft[inputData.numberOfPoints - 1];
        
        var firstVerticePolygonalChainRight = inputData.verticesPolygonalChainRight[0];
        var lastVerticePolygonalChainRight = inputData.verticesPolygonalChainRight[inputData.numberOfPoints - 1];
        
        // COURBES avant/arrière/gauche/droite
        facetteDeCoons.verticesCurveFront = ThomasScript.curveCornerCuttingVertices(inputData.verticesPolygonalChainFront, false);
        facetteDeCoons.verticesCurveBack = ThomasScript.curveCornerCuttingVertices(inputData.verticesPolygonalChainBack, false);
        facetteDeCoons.verticesCurveLeft = ThomasScript.curveCornerCuttingVertices(inputData.verticesPolygonalChainLeft, false);
        facetteDeCoons.verticesCurveRight = ThomasScript.curveCornerCuttingVertices(inputData.verticesPolygonalChainRight, false);
        
        // On rajoute les vertex de début/fin
        facetteDeCoons.verticesCurveFront.unshift(firstVerticePolygonalChainFront);
        facetteDeCoons.verticesCurveFront.push(lastVerticePolygonalChainFront);
        
        facetteDeCoons.verticesCurveBack.unshift(firstVerticePolygonalChainBack);
        facetteDeCoons.verticesCurveBack.push(lastVerticePolygonalChainBack);
        
        facetteDeCoons.verticesCurveLeft.unshift(firstVerticePolygonalChainLeft);
        facetteDeCoons.verticesCurveLeft.push(lastVerticePolygonalChainLeft);
        
        facetteDeCoons.verticesCurveRight.unshift(firstVerticePolygonalChainRight);
        facetteDeCoons.verticesCurveRight.push(lastVerticePolygonalChainRight);
        
        // PLAN entre devant/derrière
        facetteDeCoons.verticesPlaneFrontBack = this.computeSurfaceReglee(facetteDeCoons.verticesCurveFront, facetteDeCoons.verticesCurveBack);
        
        // PLAN entre gauche/droite
        facetteDeCoons.verticesPlaneLeftRight = this.computeSurfaceReglee(facetteDeCoons.verticesCurveLeft, facetteDeCoons.verticesCurveRight);
        
        facetteDeCoons.verticesPlaneBoth = this.computeFacetteDeCoons(facetteDeCoons.verticesCurveFront, facetteDeCoons.verticesCurveBack, facetteDeCoons.verticesPlaneFrontBack, facetteDeCoons.verticesPlaneLeftRight);
                
        return facetteDeCoons;
    },
    
    computeTriangles : function(vertices, length) {
        var triangles = [];
        
        for(var i = 0; i < vertices.length - length; i++) {
            triangles.push(i);
            triangles.push(i + 1);
            triangles.push(i + length);
            
            triangles.push(i + 1);
            triangles.push(i + length + 1);
            triangles.push(i + length);

            if(i % length == length - 2) {
                i++;
            }
        }  
        
        return triangles;
    },
    
    drawFacetteDeCoons : function(inputData, otherData) {
        var facetteDeCoonsData = this.computeTouteLaFacetteDeCoons(inputData);
        
        var geometryCurveFront = new THREE.Geometry();
        var geometryCurveBack = new THREE.Geometry();
        var geometryCurveLeft = new THREE.Geometry();
        var geometryCurveRight = new THREE.Geometry();
        
        var geometryFacetteDeCoons = new THREE.Geometry();
        
        geometryCurveFront.vertices = facetteDeCoonsData.verticesCurveFront;
        geometryCurveBack.vertices = facetteDeCoonsData.verticesCurveBack;
        geometryCurveLeft.vertices = facetteDeCoonsData.verticesCurveLeft;
        geometryCurveRight.vertices = facetteDeCoonsData.verticesCurveRight;
            
        var curveFront = new THREE.Line(geometryCurveFront, otherData.materialFrontBack);
        var curveBack = new THREE.Line(geometryCurveBack, otherData.materialFrontBack);
        var curveLeft = new THREE.Line(geometryCurveLeft, otherData.materialFrontBack);
        var curveRight = new THREE.Line(geometryCurveRight, otherData.materialFrontBack);
        
        curveFront.visible = false;
        curveBack.visible = false;
        curveLeft.visible = false;
        curveRight.visible = false;
        
        this.pointsCurvesFrontBack.push(curveFront);
        this.pointsCurvesFrontBack.push(curveBack);       
        this.pointsCurvesLeftRight.push(curveLeft);
        this.pointsCurvesLeftRight.push(curveRight);

        this.tw.scenes.main.add(curveFront);  
        this.tw.scenes.main.add(curveBack);  
        this.tw.scenes.main.add(curveLeft);  
        this.tw.scenes.main.add(curveRight);  
 
        // POINTS VERT (front/back)
        var pointsFrontBack = [];
        for(var i = 0; i < facetteDeCoonsData.verticesPlaneFrontBack.length; ++i) {
            var point = new THREE.Mesh(otherData.geometryPoint, otherData.materialFrontBack);
            point.visible = false;
            point.position.x = facetteDeCoonsData.verticesPlaneFrontBack[i].x;
            point.position.y = facetteDeCoonsData.verticesPlaneFrontBack[i].y;
            point.position.z = facetteDeCoonsData.verticesPlaneFrontBack[i].z;
            this.tw.scenes.main.add(point);
            pointsFrontBack.push(point);
        }  
        this.pointsPlaneFrontBack.push(pointsFrontBack);

        // POINTS BLEU (left/right)
        var pointsLeftRight = [];
        for(var i = 0; i < facetteDeCoonsData.verticesPlaneLeftRight.length; ++i) {
            var point = new THREE.Mesh(otherData.geometryPoint, otherData.materialLeftRight);
            point.visible = false;
            point.position.x = facetteDeCoonsData.verticesPlaneLeftRight[i].x;
            point.position.y = facetteDeCoonsData.verticesPlaneLeftRight[i].y;
            point.position.z = facetteDeCoonsData.verticesPlaneLeftRight[i].z;
            this.tw.scenes.main.add(point);
            pointsLeftRight.push(point);
        }
        this.pointsPlaneLeftRight.push(pointsLeftRight);
            
        // POINTS ROUGE (les 2)
        var pointsBoth = [];
        for(var i = 0; i < facetteDeCoonsData.verticesPlaneBoth.length; ++i) {
            var point = new THREE.Mesh(otherData.geometryPoint, otherData.materialBoth);
            point.visible = false;
            point.position.x = facetteDeCoonsData.verticesPlaneBoth[i].x;
            point.position.y = facetteDeCoonsData.verticesPlaneBoth[i].y;
            point.position.z = facetteDeCoonsData.verticesPlaneBoth[i].z;
            this.tw.scenes.main.add(point);
            pointsBoth.push(point);
        }
        this.pointsPlaneBoth.push(pointsBoth);
        
        geometryFacetteDeCoons.vertices = facetteDeCoonsData.verticesPlaneBoth;
        var triangles = this.computeTriangles(facetteDeCoonsData.verticesPlaneBoth, facetteDeCoonsData.numberOfPoints * 2);
        
        for(var i = 0; i < triangles.length; i+=3){
            geometryFacetteDeCoons.faces.push(new THREE.Face3(triangles[i], triangles[i+1], triangles[i+2]));
        }
        
        var facetteDeCoons = new THREE.Mesh(geometryFacetteDeCoons, otherData.materialFacette);
        facetteDeCoons.visible = false;
        this.coonsPatches.push(facetteDeCoons);
        this.tw.scenes.main.add(facetteDeCoons);
    },
    
    TerrainGeneration : function(terrainInputData) {
        var width = terrainInputData.width;
        var height = terrainInputData.height;
        var segments = terrainInputData.segments;
        var smoothingFactor = terrainInputData.smoothingFactor;

        var terrain = new Array();

        // Init
        for(var i = 0; i <= segments; i++) {
            terrain[i] = new Array();
            for(var j = 0; j <= segments; j++) {
                terrain[i][j] = 0;
            }
        }

        var size = segments + 1;
        for(var length = segments; length >= 2; length /= 2) {
            var half = length / 2;
            smoothingFactor /= 2;

            // generate the new square values
            for(var x = 0; x < segments; x += length) {
                for(var y = 0; y < segments; y += length) {
                    var average = terrain[x][y] + // top left
                    terrain[x + length][y] + // top right
                    terrain[x][y + length] + // lower left
                    terrain[x + length][y + length]; // lower right
                    average /= 4;
                    average += 2 * smoothingFactor * Math.random() - smoothingFactor;

                    terrain[x + half][y + half] = average;
                }
            }

            // generate the diamond values
            for(var x = 0; x < segments; x += half) {
                for(var y = (x + half) % length; y < segments; y += length) {
                    var average = terrain[(x - half + size) % size][y] + // middle left
                            terrain[(x + half) % size][y]+ // middle right
                            terrain[x][(y + half) % size]+ // middle top
                            terrain[x][(y - half + size) % size]; // middle bottom
                    average /= 4;
                    average += 2 * smoothingFactor * Math.random() - smoothingFactor;

                    terrain[x][y] = average;

                    // values on the top and right edges
                    if(x === 0)
                        terrain[segments][y] = average;
                    if(y === 0)
                        terrain[x][segments] = average;
                }
            }
        }
        
        return terrain;
    }
}