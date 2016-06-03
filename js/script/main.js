$(document).ready(function()  {
	
	var customsScript = [
		LucasScript,
		//ThomasScript,
		KevinScript,
		//GuillaumeScript
	];

	//*
	var threeWrapper = new ThreeWrapper({
		container : $('#main-canvas'),
		paused : false,
		hiddenCanvas : document.getElementById('hidden-canvas'),
		size : {
			width : $(document).width(),
			height : $(document).height(),
		},
		scripts : customsScript,
		orbitContainer : document.getElementById( 'main-canvas' )
	});
	//*/

	
	for (var i = 0; i < customsScript.length; ++i)
	{
		var actions = {};

		/*
		if (customsScript[i].__params)
		{
			for (var k in customsScript[i].__params)
			{
				customsScript[i][k] = customsScript[i].__params[k];
			}

			delete customsScript[i].__params;
		}
		//*/

		if (!customsScript[i].inputs)
		{
			continue;
		}

		for (var k in customsScript[i].inputs)
		{

			(function(index,key){
				actions[key] = function(three)
				{
					customsScript[index].inputs[key](customsScript[index], three);
				}
			})(i,k);
		}

		new InputsListeners({
		context : threeWrapper,
		keys : actions});

	}
	

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
			'p' : function(three) {
				three.pause();
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

