var LucasScript = {

    init: function (tw) {

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
        
        
        /* var materialFacette = new THREE.MeshPhongMaterial( { color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading, side : THREE.DoubleSide} )*/

        var directionalLight = new THREE.DirectionalLight( 0xffffff );
        directionalLight.position.set( 0, 10, 0 );
        tw.scenes.main.add( directionalLight );
        
        /*var light = new THREE.PointLight( 0xff0000, 1, 100 );
        light.position.set( 0, 5, 0 );
        tw.scenes.main.add( light );*/
        
        tw.cameras.main.position.z = 25;
        tw.cameras.main.position.y = 9;
        tw.cameras.main.rotation.x = -20 * Math.PI / 180;
    },

    update: function (tw, deltaTime) {


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


    }
}