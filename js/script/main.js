$(document).ready(function()  {
	
	//*
	var threeWrapper = new ThreeWrapper({
		container : $('#main-canvas'),
		paused : false,
		hiddenCanvas : document.getElementById('hidden-canvas'),
		size : {
			width : $(document).width(),
			height : $(document).height(),
		},
		orbitContainer : document.getElementById( 'main-canvas' ),
		
	});
	//*/

	var inputs = new InputsListeners({
		context : threeWrapper,
		container :  $('#bottom-content'),
		keys : {
			plus : function(three) {
				three.speedUp();
			},
			minus : function(three) {
				three.slowDown();
			},

			'z' : function(three){
				three.entities[three.entities.length-1].add(new THREE.Vector3(0, three.gridStep, 0));
			},
			's' : function(three){
				three.entities[three.entities.length-1].add(new THREE.Vector3(0, -three.gridStep, 0));
			},
			'q' : function(three){
				three.entities[three.entities.length-1].add(new THREE.Vector3(-three.gridStep, 0, 0));
			},
			'd' : function(three){
				three.entities[three.entities.length-1].add(new THREE.Vector3(three.gridStep, 0, 0));
			},
			'p' : function(three) {
				three.pause();
			},
			'n' : function(three) {
				
				three.initSquaredEntities({count : 1});
				//three.initEntities({count : 10});

			},
			't' : function(three) {
				three.executeActions(new Actions( {validate : [three.entitiesManager.last] } ) );
			},
			'y' : function(three) {
				console.log(three.grid.gridToString());
			},
			'c' : function(three) {

				for(var k in three.entitiesManager.entities){

					var col = three.entitiesManager.entities[k].actions.rules.getsquare(three);
					
			

					if(col){
						three.entitiesManager.entities[k].setColor(col);
					}
	
				}
				
			},
			'm' : function(three) {

				for(var k in three.entitiesManager.entities){
					three.entitiesManager.entities[k].destination = three.getRandomPositionInImagePlane(
						three.entitiesManager.entities[k].object.position.z
					);
				}
			},
			'r' : function (three) {

				if(three.entitiesManager.last.old){
					three.entitiesManager.last.destination = new THREE.Vector3(1,1,1);
					
					three.entitiesManager.last.destination.copy(three.entitiesManager.last.old);

					delete three.entitiesManager.last.old;
				}
				else {
					three.entitiesManager.last.old = new THREE.Vector3(1,1,1);
					three.entitiesManager.last.old.copy(three.entitiesManager.last.getPosition());

					three.entitiesManager.last.destination = new THREE.Vector3(
					three.entitiesManager.last.getPosition().x, 
					three.entitiesManager.last.getPosition().y,
					0);
				}
			
			}
		}
	});
	
	threeWrapper.render();
});


THREE.StaticShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"time":     { type: "f", value: 0.0 },
		"amount":   { type: "f", value: 0.5 },
		"size":     { type: "f", value: 4.0 }
	},

	vertexShader: [

	"varying vec2 vUv;",

	"void main() {",

		"vUv = uv;",
		"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

	"}"

	].join("\n"),

	fragmentShader: [

	"uniform sampler2D tDiffuse;",
	"uniform float time;",
	"uniform float amount;",
	"uniform float size;",

	"varying vec2 vUv;",

	"float rand(vec2 co){",
		"return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);",
	"}",

	"void main() {",
		"vec2 p = vUv;",
		"vec4 color = texture2D(tDiffuse, p);",
		"float xs = floor(gl_FragCoord.x / size);",
		"float ys = floor(gl_FragCoord.y / size);",
		"vec4 snow = vec4(rand(vec2(xs * time,ys * time))*amount);",

		//"gl_FragColor = color + amount * ( snow - color );", //interpolate

		"gl_FragColor = color+ snow;", //additive

	"}"

	].join("\n")

};

