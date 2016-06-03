var LucasScript = {

    init: function (tw) {

        this.numberOfPoints = 10;
        
        var me = this;
        
        this.tabFrontLinePoint = [];
        this.tabBackLinePoint = [];
        this.tabRightLinePoint = [];
        this.tabLeftLinePoint = [];
        this.tabForTotalPoint = [];
        this.tabOfFace = [];
        
        this.myCamera = new THREE.OrthographicCamera(-20, 20, 20 / tw.aspect, -20 / tw.aspect, 0, 1000);

        //only one geometry necessary   
        var geometry = new THREE.PlaneGeometry(20, 20, 20);

        var white_material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.SingleSide
        });
        
       /* var red_material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            side: THREE.SingleSide
        });
        
        var green_material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            side: THREE.SingleSide
        });
        
        var blue_material = new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            side: THREE.SingleSide
        });*/

        this.backface_plane = new THREE.Mesh(geometry, white_material);
        this.frontface_plane = new THREE.Mesh(geometry, white_material);
        this.leftface_plane = new THREE.Mesh( geometry, white_material );
        this.rightface_plane = new THREE.Mesh( geometry, white_material );

        this.tabOfFace.push(this.backface_plane);
        this.tabOfFace.push(this.leftface_plane);
        this.tabOfFace.push(this.frontface_plane);
        this.tabOfFace.push(this.rightface_plane);

        this.backface_plane.position.y = 10;
        this.backface_plane.position.z = -10;
        
        this.frontface_plane.position.y = 10;
        this.frontface_plane.position.z = 10;
        this.frontface_plane.rotation.y = 180 * Math.PI /180 ;
        
        this.leftface_plane.position.y = 10;
        this.leftface_plane.position.x = -10;
        this.leftface_plane.rotation.y = 90 * Math.PI /180 ;
        
        this.rightface_plane.position.y = 10;
        this.rightface_plane.position.x = 10;
        this.rightface_plane.rotation.y = -90 * Math.PI /180 ;
        
        tw.scenes.main.add(this.backface_plane);
        tw.scenes.main.add(this.frontface_plane);
        tw.scenes.main.add(this.leftface_plane);
        tw.scenes.main.add(this.rightface_plane);
        
        //Lumiere sur les facettes de coons
        var directionalLight = new THREE.DirectionalLight( 0xffffff );
        directionalLight.position.set( 0, 10, 0 );
        tw.scenes.main.add( directionalLight );
          
        tw.cameras.main.position.z = 25;
        tw.cameras.main.position.y = 9;
        tw.cameras.main.rotation.x = -20 * Math.PI / 180;
        
        //POUR LE PICKING (VIEN DU  SCRIPT DE THOMAS)
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.tw = tw;
        
        tw.container[0].addEventListener( 'mousedown', 
        	function(e) {
            
        		if (e.button === 0 && e.ctrlKey)
                {
                        
        			 me.onMouseDown(e, me);
                }

        	},
        false );
        
    },

    update: function (tw, deltaTime) {8


    },
    
     triangleTOTO: function (triangles) {
    var triangle = null;
    var edges = null;
    var edge = null;
    for (var i = 0; i < triangles.length; ++i) {
        triangle = triangles[i]
        edges = triangle.getEdges();

        for (var j = 0; j < edges.length; ++j) {
            edge = edges[j];

            edge.setTriangle(triangle);

            if (edge.v1.incidentEdges.indexOf(edge) < 0)
                edge.v1.pushIncidentEdge(edge);

            if (edge.v2.incidentEdges.indexOf(edge) < 0)
                edge.v2.pushIncidentEdge(edge);
            }
        }
    },
    
    trianglesToPolygones : function(triangles)
    {
        var onePolygone = new Polygone();
        var polygones = [];
        for(var i =  0 ; i < triangles.length ; i++)
        {
            //onePolygone.setEdges(triangles[i].e1,triangles[i].e2,triangles[i].e3);
            onePolygone.pushEdge(triangles[i].e1);
            onePolygone.pushEdge(triangles[i].e2);
            onePolygone.pushEdge(triangles[i].e3);
            polygones.push(onePolygone);
        }
        
        return polygones;
    },
    

    
    onMouseDown : function(event, ctx) 
    {
    	// calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        
        ctx.mouse.x = ( event.layerX / ctx.tw.size.width ) * 2 - 1;
        ctx.mouse.y = - ( event.layerY / ctx.tw.size.height ) * 2 + 1;	
        
        // update the picking ray with the camera and mouse position	
        ctx.raycaster.setFromCamera( ctx.mouse, ctx.tw.cameras.CURRENT);	

        // calculate objects intersecting the picking ray
        var intersects = ctx.raycaster.intersectObjects( ctx.tw.scenes.main.children );


        for ( var i = 0; i < intersects.length; i++ ) {
            if(intersects[ i ].object == ctx.tabOfFace[0]) {
            	
                var fixedCoord;
                if(ctx.tabBackLinePoint.length == 0) {
                    fixedCoord = -10;
                } else if(ctx.tabBackLinePoint.length == ctx.numberOfPoints - 1) {
                    fixedCoord = 10;
                } else {
                    fixedCoord = intersects[ i ].point.x;
                }
                
            	ctx.tabBackLinePoint.push(new THREE.Vector3(fixedCoord, intersects[i].point.y, 10.0));
                
                console.log("POINT PLACE BACK");
                if(ctx.tabBackLinePoint.length > 1)
                {
                    var material = new THREE.LineBasicMaterial({
                    color: 0x0000ff });
                        
                    var geometry = new THREE.Geometry();
                    for(var j = 0 ; j < ctx.tabBackLinePoint.length;j++)
                    {
                        geometry.vertices.push(ctx.tabBackLinePoint[j]);  
                    }
                   
                    if(this.lineBack) {
                        this.lineBack.visible = false;
                    }
                    this.lineBack = new THREE.Line( geometry, material );
                    ctx.tw.scenes.main.add( this.lineBack );
                    if(ctx.tabBackLinePoint.length == ctx.numberOfPoints) {
                        ctx.inputs['6'](ctx, ctx.tw);
                    }
                                    }
                
              	
                break;
            }
            if(intersects[i].object == ctx.tabOfFace[1])
            {
                
                var fixedCoord, fixedCoord2;
                if(ctx.tabLeftLinePoint.length == 0) {
                    fixedCoord = 10;
                    fixedCoord2 = ctx.tabBackLinePoint[ctx.numberOfPoints - 1].y;
                } else if(ctx.tabLeftLinePoint.length == ctx.numberOfPoints - 1) {
                    fixedCoord = -10;
                    fixedCoord2 = intersects[i].point.y;
                } else {
                    fixedCoord = intersects[ i ].point.z;
                    fixedCoord2 = intersects[i].point.y;
                }
                
                ctx.tabLeftLinePoint.push(new THREE.Vector3(10.0, fixedCoord2, fixedCoord));
                
                console.log("POINT PLACE LEFTc");
                if(ctx.tabLeftLinePoint.length > 1)
                {
                    var material = new THREE.LineBasicMaterial({
                    color: 0x00ff00 });
                        
                    var geometry = new THREE.Geometry();
                    for(var j = 0 ; j < ctx.tabLeftLinePoint.length;j++)
                    {
                        geometry.vertices.push(ctx.tabLeftLinePoint[j]);  
                    }
                                   
                    if(this.lineLeft) {
                        this.lineLeft.visible = false;
                    }
                    this.lineLeft = new THREE.Line( geometry, material );
                    ctx.tw.scenes.main.add( this.lineLeft );
                    if(ctx.tabLeftLinePoint.length == ctx.numberOfPoints) {
                        ctx.inputs['8'](ctx, ctx.tw);
                    }
                                    }
                
              	
            break;
            }
            if(intersects[i].object == ctx.tabOfFace[2])
            {
                
                var fixedCoord, fixedCoord2;
                if(ctx.tabFrontLinePoint.length == 0) {
                    fixedCoord = 10;
                    fixedCoord2 = ctx.tabLeftLinePoint[ctx.numberOfPoints - 1].y;
                } else if(ctx.tabFrontLinePoint.length == ctx.numberOfPoints - 1) {
                    fixedCoord = -10;
                    fixedCoord2 = intersects[i].point.y;
                } else {
                    fixedCoord = intersects[ i ].point.x;
                    fixedCoord2 = intersects[i].point.y;
                }
                
                ctx.tabFrontLinePoint.push(new THREE.Vector3(fixedCoord, fixedCoord2, -10.0));
                
                console.log("POINT PLACE FRONT");
                if(ctx.tabFrontLinePoint.length > 1)
                {
                    var material = new THREE.LineBasicMaterial({
                    color: 0x0000ff });
                        
                    var geometry = new THREE.Geometry();
                    for(var j = 0 ; j < ctx.tabFrontLinePoint.length;j++)
                    {
                        geometry.vertices.push(ctx.tabFrontLinePoint[j]);  
                    }
                   /*geometry.vertices[ctx.tabFrontLinePoint.length-1] = new THREE.Vector3(-10,geometry.vertices[ctx.tabFrontLinePoint.length-1].y,-10.0);*/
                    
                    if(this.lineFront) {
                        this.lineFront.visible = false;
                    }
                    this.lineFront = new THREE.Line( geometry, material );
                    ctx.tw.scenes.main.add( this.lineFront );
                    if(ctx.tabFrontLinePoint.length == ctx.numberOfPoints) {
                        ctx.inputs['4'](ctx, ctx.tw);
                    }
                                    }
                
              	
            break;
            }
            if(intersects[i].object == ctx.tabOfFace[3])
            {
                
                var fixedCoord, fixedCoord2;
                if(ctx.tabRightLinePoint.length == 0) {
                    fixedCoord = -10;
                    fixedCoord2 = ctx.tabFrontLinePoint[ctx.numberOfPoints - 1].y;
                } else if(ctx.tabRightLinePoint.length == ctx.numberOfPoints - 1) {
                    fixedCoord = 10;
                    fixedCoord2 = ctx.tabBackLinePoint[0].y;
                } else {
                    fixedCoord = intersects[ i ].point.z;
                    fixedCoord2 = intersects[i].point.y;
                }
                
                ctx.tabRightLinePoint.push(new THREE.Vector3(-10.0, fixedCoord2, fixedCoord));
                
                console.log("POINT PLACE RIGHT");
                if(ctx.tabRightLinePoint.length > 1)
                {
                    var material = new THREE.LineBasicMaterial({
                    color: 0x00ff00 });
                        
                    var geometry = new THREE.Geometry();
                    for(var j = 0 ; j < ctx.tabRightLinePoint.length;j++)
                    {
                        geometry.vertices.push(ctx.tabRightLinePoint[j]);  
                    }
                    
                    if(this.lineRight) {
                        this.lineRight.visible = false;
                    }
                    this.lineRight = new THREE.Line( geometry, material );
                    ctx.tw.scenes.main.add( this.lineRight );
                    if(ctx.tabRightLinePoint.length == ctx.numberOfPoints) {
                        ctx.inputs['c'](ctx, ctx.tw);
                    }
                                    }
                
              	
            break;
            }
            
        }
    },

    inputs: {

        '5': function (me, tw) {
            tw.changeCamera(me.myCamera);
            console.log("t");
            me.myCamera.position.x = 0;
            me.myCamera.position.y = 10;
            me.myCamera.position.z = 0;

            me.myCamera.rotation.x = -90 * Math.PI / 180;
            me.myCamera.rotation.y = 0 * Math.PI / 180;


        },


        //Camera front face
        '2': function (me, tw) {
            tw.changeCamera(me.myCamera);
            me.myCamera.position.x = 0;
            me.myCamera.position.y = 6;
            me.myCamera.position.z = 10;


            me.myCamera.rotation.x = 0 * Math.PI / 180;
            me.myCamera.rotation.y = 0 * Math.PI / 180;


        },


        //Camera back face
        '8': function (me, tw) {
            tw.changeCamera(me.myCamera);
            me.myCamera.position.x = 0;
            me.myCamera.position.y = 6;
            me.myCamera.position.z = -10;
            //NOT GOOD

            me.myCamera.rotation.x = -0 * Math.PI / 180;
            me.myCamera.rotation.y = 180 * Math.PI / 180;

        },


        //Camera left face
        '4': function (me, tw) {
            tw.changeCamera(me.myCamera);
            me.myCamera.position.x = -10;
            me.myCamera.position.y = 6;
            me.myCamera.position.z = 0;

            me.myCamera.rotation.x = 0 * Math.PI / 180;
            me.myCamera.rotation.y = -90 * Math.PI / 180;

        },


        //Camera right face
        '6': function (me, tw) {
            tw.changeCamera(me.myCamera);
            me.myCamera.position.x = 10;
            me.myCamera.position.y = 6;
            me.myCamera.position.z = 0;

            me.myCamera.rotation.x = 0 * Math.PI / 180;
            me.myCamera.rotation.y = 90 * Math.PI / 180;

        },

        //Perspective camera
        'c': function (me, tw) {
            tw.changeCamera(tw.cameras.main);

        },
        
        'y' : function (me, tw)
        {
            //Creation aile d'avion
            console.log("ICI AUSSI LES INPUTS MARCHENT");
            
           
		
   var v0 = new Vertex(0.0, 0.0, 0.0);
   var v1 = new Vertex(1.0, 0.0, 0.0);
   var v2 = new Vertex(1.0, 1.0, 0.0);
   var v3 = new Vertex(0.0, 1.0, 0.0);

   var v4 = new Vertex(0.0, 0.0, 1.0);
   var v5 = new Vertex(1.0, 0.0, 1.0);
   var v6 = new Vertex(1.0, 1.0, 1.0);
   var v7 = new Vertex(0.0, 1.0, 1.0);

   var vertice = [v0, v1, v2, v3, v4, v5, v6, v7];
        
        //FACE FRONT
 var e0 = new Edge(v0, v1);
 var e1 = new Edge(v1, v3);
 var e2 = new Edge(v3, v0);

 var e3 = new Edge(v1, v2);
 var e4 = new Edge(v2, v3);




 //FACE RIGHT

 var e5 = new Edge(v1, v5);
 var e6 = new Edge(v5, v6);
 var e7 = new Edge(v6, v1);

 var e8 = new Edge(v6, v2);


 //FACE BACK  
 var e9 = new Edge(v5, v4);
 var e10 = new Edge(v4, v7);
 var e11 = new Edge(v7, v5);



 var e12 = new Edge(v7, v6);

 //FACE LEFT

 var e13 = new Edge(v4, v0);
 var e14 = new Edge(v0, v7);
 var e15 = new Edge(v7, v3);


 //FACE DOWN
 var e16 = new Edge(v0, v5);
 //FACE UP
 var e17 = new Edge(v3, v6);
            
            
var edges = [e0, e1, e2, e3, e4, e5, e6, e7, e8, e9, e10, e11, e12, e13, e14, e15, e16, e17];

//FRONT FACE
var t0 = new Triangle(e0, e1, e2);

var t1 = new Triangle(e3, e4, e1);

//RIGTH FACE
var t2 = new Triangle(e5, e6, e7);
var t3 = new Triangle(e8, e3, e7);

//BACK FACE
var t4 = new Triangle(e9, e10, e11);
var t5 = new Triangle(e12, e6, e11);
//LEFT FACE
var t6 = new Triangle(e13, e14, e10);
var t7 = new Triangle(e15, e14, e2);
//DOWN FACE
var t8 = new Triangle(e0, e5, e16);
var t9 = new Triangle(e9, e13, e16);
//UP FACE
var t10 = new Triangle(e12, e15, e17);
var t11 = new Triangle(e4, e8, e17);


var triangles = [t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11];

me.triangleTOTO(triangles);

/*var loop = new Loop(vertice, edges, triangles);
var meshLoop = loop.launchLoop();*/
        

            
/*var STpolygones = me.trianglesToPolygones(meshLoop.polygones);
meshLoop.polygones = STpolygones;
console.log("APRES MOD");            
console.log(meshLoop);*/
//CONSTRUCTION DE POLYGONES            


var kobbelt = new Kobbelt(vertice, edges, triangles);
var meshLoop = kobbelt.launchKobbelt();            
            
 var materialObject = new THREE.MeshPhongMaterial( { color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading, side: THREE.SingleSide} );
    tw.scenes.main.add(meshLoop.buildThreeMesh(materialObject));    
            
        },
        
        'f' : function (me, tw)
        {
            this.tabForCoons = [];
           
            
            me.lineFront.visible = false;
            me.lineLeft.visible = false;
            me.lineBack.visible = false;
            me.lineRight.visible = false;

            for(var i = 0 ; i < me.tabFrontLinePoint.length ; i++)
            {
                this.tabForCoons.push(me.tabFrontLinePoint[i]);
                
            }
            
            for(var i = 0 ; i < me.tabRightLinePoint.length ; i++)
            {
                this.tabForCoons.push(me.tabRightLinePoint[i]);        
            }
            
            for(var i = 0 ; i < me.tabBackLinePoint.length ; i++)
            {
                this.tabForCoons.push(me.tabBackLinePoint[i]);        
            }
            
            for(var i = 0 ; i < me.tabLeftLinePoint.length ; i++)
            {
                this.tabForCoons.push(me.tabLeftLinePoint[i]);        
            }
            
            this.tabForCoons.push(me.tabFrontLinePoint[0]);
            
            me.tabBackLinePoint.reverse();
            me.tabRightLinePoint.reverse();
            
            GuillaumeScript.drawFacetteDeCoons({
                numberOfPoints : me.numberOfPoints,
                verticesPolygonalChainFront : me.tabBackLinePoint,
                verticesPolygonalChainBack : me.tabFrontLinePoint,
                verticesPolygonalChainLeft : me.tabLeftLinePoint,
                verticesPolygonalChainRight : me.tabRightLinePoint
            }, GuillaumeScript.otherData);
            
            var material = new THREE.LineBasicMaterial({
            color: 0xff0000 });
                        
            var geometry = new THREE.Geometry();
            for(var j = 0 ; j < this.tabForCoons.length;j++)
            {
                geometry.vertices.push(this.tabForCoons[j]);  
            }
                   
            console.log("DESSIN LIGNE");
            var line = new THREE.Line( geometry, material );
            line.visible = false;
            tw.scenes.main.add( line ); 
        }
    }
    
    
    
}