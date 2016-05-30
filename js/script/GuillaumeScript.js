var GuillaumeScript = {

	init : function( tw )
	{
        var size = 10;
        var step = 1;

        var gridHelper = new THREE.GridHelper( size, step );
        tw.scenes.main.add( gridHelper );
	},

	update : function ( tw , deltaTime )
	{
		
	}
}

/*
        
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
*/