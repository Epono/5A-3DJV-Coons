var KevinScript = {

	init : function( tw )
	{
        this.cptApush = 0;
        var v0 = new Vertex(0.0, 0.0, 0.0);
        var v1 = new Vertex(1.0, 0.0, 0.0);
        var v2 = new Vertex(1.0, 1.0, 0.0);
        var v3 = new Vertex(0.0, 1.0, 0.0);
        
        var v4 = new Vertex(0.0, 0.0, 1.0);
        var v5 = new Vertex(1.0, 0.0, 1.0);
        var v6 = new Vertex(1.0, 1.0, 1.0);
        var v7 = new Vertex(0.0, 1.0, 1.0);
        
        this.vertice = [v0, v1, v2, v3, v4, v5, v6, v7];

        var e0 = new Edge(v0, v1);
        var e1 = new Edge(v1, v2);
        var e2 = new Edge(v2, v3);
        var e3 = new Edge(v3, v0);

        var e4 = new Edge(v4, v5);
        var e5 = new Edge(v5, v6);
        var e6 = new Edge(v6, v7);
        var e7 = new Edge(v7, v4);
        
        var e8 = new Edge(v0, v4);
        var e9 = new Edge(v1, v5);
        var e10 = new Edge(v2, v6);
        var e11 = new Edge(v3, v7);
        
        this.edges = [e0, e1, e2, e3, e4, e5, e6, e7, e8, e9, e10, e11];
        
        
        var p0 = new Polygone();
        p0.setEdges([e0, e1, e2, e3]);
        
        var p1 = new Polygone();
        p1.setEdges([e9, e5, e10, e1]);
        
        var p2 = new Polygone();
        p2.setEdges([e4, e5, e6, e7]);
        
        var p3 = new Polygone();
        p3.setEdges([e8, e7, e11, e3]);
        
        var p4 = new Polygone();
        p4.setEdges([e0, e9, e4, e8]);
        
        var p5 = new Polygone();
        p5.setEdges([e2, e10, e6, e11]);
        
        this.polygones = [p0, p1, p2, p3, p4, p5];
        
        this.setAllBudule(this.polygones);
        
        
        //CREATION DU CUBE
        //tw.scenes.main.add(newMesh.buildThreeMesh());
        
        
        /*var cc = new CatmullClark(vertice, edges, polygones);

        var newMesh = cc.launchCatmullClark();

        var cc2 = new CatmullClark(newMesh.getVertice(), newMesh.getEdges(), newMesh.polygones);

        var newMesh2 = cc2.launchCatmullClark();

        var cc3 = new CatmullClark(newMesh2.getVertice(), newMesh2.getEdges(), newMesh2.polygones);

        var newMesh3 = cc3.launchCatmullClark();
        
        console.log(newMesh3);*/
/*
        // Plane
        var geometryPlane = new THREE.PlaneGeometry( 20, 20, 32 );
        var materialPlane = new THREE.MeshBasicMaterial( {color: 0xFFFFFF, side: THREE.DoubleSide} );
        var plane = new THREE.Mesh( geometryPlane, materialPlane );
        plane.rotation.x = Math.PI / 2;
        plane.position.y = - 0.1;
        tw.scenes.main.add( plane );
        // Super
        //tw.scenes.main.add(new Mesh(polygones).buildThreeMesh());
        tw.scenes.main.add(newMesh3.buildThreeMesh());*/
	},

	update : function ( tw , deltaTime )
	{
		
	},

	inputs : {
		'a' : function(me, tw){
            var cc;
            var monOb; 

            var materialObject = new THREE.MeshPhongMaterial( { color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading, side: THREE.DoubleSide} );

            if(!this.newMesh)
            {
                cc = new CatmullClark(me.vertice, me.edges, me.polygones);
                this.newMesh = cc.launchCatmullClark();
                monOb = this.newMesh.buildThreeMesh(materialObject);
                monOb.position.z = 2;
                this.cptApush = 1;
                tw.scenes.main.add(monOb);
            }
            else
            {
                if(this.cptApush < 5) {
                    cc = new CatmullClark(this.newMesh.getVertice(),this.newMesh.getEdges(), this.newMesh.polygones); 
                    //this.newMesh.visible = false;
                    this.newMesh = cc.launchCatmullClark();
                    monOb = this.newMesh.buildThreeMesh(materialObject);
                    monOb.position.z = 2;
                    monOb.position.x = this.cptApush;
                    this.cptApush++;
                    tw.scenes.main.add(monOb);
                }
            }    
		}
	},

	setAllBudule : function(polygones)
	{
		var polygone = null;
		var edges = null;
		var edge = null;
		for(var i = 0; i < polygones.length; ++i)
		{
			polygone = polygones[i]
			edges = polygone.edges;

			for(var j = 0; j < edges.length; ++j)
			{
				edge = edges[j];
				
				edge.setPolygone(polygone);
				
				if(edge.v1.incidentEdges.indexOf(edge) < 0)
					edge.v1.pushIncidentEdge(edge);
				
				if(edge.v2.incidentEdges.indexOf(edge) < 0)
					edge.v2.pushIncidentEdge(edge);
			}
		}
	},
    
     setAllTriangles : function(triangles)
		{
			var triangle = null;
			var edges = null;
			var edge = null;
			for(var i = 0; i < triangles.length; ++i)
			{
				triangle = triangles[i]
				edges = triangle.getEdges();

				for(var j = 0; j < edges.length; ++j)
				{
					edge = edges[j];
					
					edge.setTriangle(triangle);
					
					if(edge.v1.incidentEdges.indexOf(edge) < 0)
						edge.v1.pushIncidentEdge(edge);
					
					if(edge.v2.incidentEdges.indexOf(edge) < 0)
						edge.v2.pushIncidentEdge(edge);
				}
			}
		},
}