var LucasScript = {

	init : function( tw )
	{
       
        
        
	},

	update : function ( tw , deltaTime )
	{
		

	},
    
    
    inputs : {
    
    '5': function(me,tw)
    {
        tw.cameras.main = new THREE.OrthographicCamera(-20, 20, 20/tw.aspect, -20/tw.aspect, 0, 1000 );
        tw.cameras.main.position.x = 0;
        tw.cameras.main.position.y = 10;
        tw.cameras.main.position.z = 0;
        tw.cameras.main.rotation.x = -90 * Math.PI / 180;
        
        
    },
        
        
    //Camera front face
    '2' : function(me,tw)
    {
        tw.cameras.main = new THREE.OrthographicCamera(-20, 20, 20/tw.aspect, -20/tw.aspect, 0, 1000 );
        tw.cameras.main.position.x = 0;
        tw.cameras.main.position.y = 0;
        tw.cameras.main.position.z = 10;
      
        
    },
        
        
    //Camera back face
    '8' : function(me,tw)
    {
       tw.cameras.main = new THREE.OrthographicCamera(-20, 20, 20/tw.aspect, -20/tw.aspect, 0, 1000 );
        tw.cameras.main.position.x = 0;
        tw.cameras.main.position.y = 0;
        tw.cameras.main.position.z = -10;
        //NOT GOOD
        tw.cameras.main.rotation.y = 180 * Math.PI / 180;
        
    },
        
        
    //Camera left face
    '4' : function(me,tw)
    {
       tw.cameras.main = new THREE.OrthographicCamera(-20, 20, 20/tw.aspect, -20/tw.aspect, 0, 1000 );
        tw.cameras.main.position.x = -10;
        tw.cameras.main.position.y = 0;
        tw.cameras.main.position.z = 0;
        tw.cameras.main.rotation.y = -90 * Math.PI / 180;
        
    },
        
        
        //Camera right face
    '6' : function(me,tw)
    {
       tw.cameras.main = new THREE.OrthographicCamera(-20, 20, 20/tw.aspect, -20/tw.aspect, 0, 1000 );
        tw.cameras.main.position.x = 10;
        tw.cameras.main.position.y = 0;
        tw.cameras.main.position.z = 0;
        tw.cameras.main.rotation.y = 90 * Math.PI / 180;
        
    },
    
        //Perspective camera
    'c' : function(me,tw)
    {
            tw.cameras.main = new THREE.PerspectiveCamera(
			tw.VIEW_ANGLE,
			tw.aspect,
			tw.NEAR,
			tw.FAR
		);
            
            
        tw.cameras.main.position.z = tw.CAMERA_Z;
    },
        
        
    }
}