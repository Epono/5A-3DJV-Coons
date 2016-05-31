var LucasScript = {

	init : function( tw )
	{
       
        this.myCamera = new THREE.OrthographicCamera(-20, 20, 20/tw.aspect, -20/tw.aspect, 0, 1000 );
        
	},

	update : function ( tw , deltaTime )
	{
		

	},
    
    
    inputs : {
    
    '5': function(me,tw)
    {
        tw.changeCamera(me.myCamera); 
       console.log("t");
        me.myCamera.position.x = 0;
        me.myCamera.position.y = 10;
        me.myCamera.position.z = 0;
        
        me.myCamera.rotation.x = -90 * Math.PI / 180;
        me.myCamera.rotation.y = 0 * Math.PI / 180;
        
        
    },
        
        
    //Camera front face
    '2' : function(me,tw)
    {
        tw.changeCamera(me.myCamera); 
        me.myCamera.position.x = 0;
        me.myCamera.position.y = 0;
        me.myCamera.position.z = 10;
        
        
        me.myCamera.rotation.x = 0 * Math.PI / 180;
        me.myCamera.rotation.y = 0 * Math.PI / 180;
        
        
    },
        
        
    //Camera back face
    '8' : function(me,tw)
    {
        tw.changeCamera(me.myCamera); 
        me.myCamera.position.x = 0;
        me.myCamera.position.y = 0;
        me.myCamera.position.z = -10;
        //NOT GOOD
        
        me.myCamera.rotation.x = -0 * Math.PI / 180;
        me.myCamera.rotation.y = 180 * Math.PI / 180;
        
    },
        
        
    //Camera left face
    '4' : function(me,tw)
    {
        tw.changeCamera(me.myCamera); 
        me.myCamera.position.x = -10;
        me.myCamera.position.y = 0;
        me.myCamera.position.z = 0;
        
        me.myCamera.rotation.x = 0 * Math.PI / 180;
        me.myCamera.rotation.y = -90 * Math.PI / 180;
        
    },
        
        
        //Camera right face
    '6' : function(me,tw)
    {
       tw.changeCamera(me.myCamera); 
        me.myCamera.position.x = 10;
       me.myCamera.position.y = 0;
        me.myCamera.position.z = 0;
       
        me.myCamera.rotation.x = 0 * Math.PI / 180;
        me.myCamera.rotation.y = 90 * Math.PI / 180;
        
    },
    
        //Perspective camera
    'c' : function(me,tw)
    {
        tw.changeCamera(tw.cameras.main);
           
    },
        
        
    }
}