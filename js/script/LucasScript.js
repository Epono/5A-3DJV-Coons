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
            	
               
            	ctx.tabBackLinePoint.push(new THREE.Vector3(intersects[ i ].point.x, intersects[i].point.y, 10.0));
                
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
                   

                    var line = new THREE.Line( geometry, material );
                    //line.visible = false;
                    ctx.tw.scenes.main.add( line );
                    if(ctx.tabBackLinePoint.length == ctx.numberOfPoints) {
                        ctx.inputs['6'](ctx, ctx.tw);
                    }
                                    }
                
              	
                break;
            }
            if(intersects[i].object == ctx.tabOfFace[1])
            {
                ctx.tabLeftLinePoint.push(new THREE.Vector3(10.0, intersects[i].point.y, intersects[i].point.z));
                
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
                   

                    var line = new THREE.Line( geometry, material );
                    ctx.tw.scenes.main.add( line ); 
                    if(ctx.tabLeftLinePoint.length == ctx.numberOfPoints) {
                        ctx.inputs['8'](ctx, ctx.tw);
                    }
                                    }
                
              	
            break;
            }
            if(intersects[i].object == ctx.tabOfFace[2])
            {
                ctx.tabFrontLinePoint.push(new THREE.Vector3(intersects[ i ].point.x, intersects[i].point.y, -10.0));
                
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

                    var line = new THREE.Line( geometry, material );
                    ctx.tw.scenes.main.add( line );
                    if(ctx.tabFrontLinePoint.length == ctx.numberOfPoints) {
                        ctx.inputs['4'](ctx, ctx.tw);
                    }
                                    }
                
              	
            break;
            }
            if(intersects[i].object == ctx.tabOfFace[3])
            {
                ctx.tabRightLinePoint.push(new THREE.Vector3(-10.0, intersects[i].point.y, intersects[i].point.z));
                
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
                   

                    var line = new THREE.Line( geometry, material );
                    ctx.tw.scenes.main.add( line ); 
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
            
            //TODO utilisation des fonctions de guillaume
            
            
            
        },
        
        'f' : function (me, tw)
        {
            this.tabForCoons = [];
           /* var totalPointToAdd = me.tabFrontLinePoint.length + me.tabLeftLinePoint.length + me.tabBackLinePoint.length + me.tabRightLinePoint.length;*/
            
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
            
            console.log(this.numberOfPoints);
            console.log(me.tabBackLinePoint);
            console.log(me.tabFrontLinePoint);
            console.log(me.tabLeftLinePoint);
            console.log(me.tabRightLinePoint);
            
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