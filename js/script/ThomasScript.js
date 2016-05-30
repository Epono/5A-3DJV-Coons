var ThomasScript = {

	init : function( tw )
	{
		var geometry = new THREE.BoxGeometry( 1, 1, 1 );
		var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
		var cube = new THREE.Mesh( geometry, material );
		this.cube = cube;
		console.log("super");

		tw.scenes.main.add( this.cube );
	},

	update : function ( tw , deltaTime )
	{
		this.cube.rotation.x += 0.1;

	},

	inputs : {
		'a' : function (me, tw)
		{
			
		}
	}
}