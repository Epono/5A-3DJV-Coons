class Kobbelt
{
    // Constructor
    constructor(vertice, edges, triangles)
    {
        this.vertice = [];
        this.edges = [];
        this.triangles = [];
        
        this.kobbeltVertice = vertice;
        this.kobbeltEdges = edges;
        this.kobbeltTriangles = triangles;
    }
    
    // Setter
    setVertice(vertice)
    {
        this.vertice = vertice;
        this.kobbeltVertice = vertice;
    } 
    setEdges(edges)
    {
        this.edges = edges;
        this.kobbeltEdges = edges;
    } 
    setTriangles(triangles)
    {
        this.triangles = triangles;
        this.kobbeltTriangles = triangles;    
    }

    
    // Push un vertex dans la liste des nouveaux Vertex
    pushKobbeltVertex(vertex)
    {
        if(this.kobbeltVertice.indexOf(vertex) < 0)
            this.kobbeltVertice.push(vertex);
    }
    
    // Push l'edge dans la liste des nouvelles edges 
    // en settant les edges incidentes pour les vertice composant l'edge
    pushKobbeltEdge(edge)
    {
        this.kobbeltEdges.push(edge);
        // Ajout de l'edge adjacente aux vertice de l'edge
        edge.v1.incidentEdges.push(edge);
        edge.v2.incidentEdges.push(edge);
    }
    
    // Push le triangle dans la liste des nouveaux triangles 
    // en settant le triangle gauche ou droit des edges composant le triangle
    pushKobbeltTriangle(triangle)
    {
        this.kobbeltTriangles.push(triangle);
        // Ajout du triangle (gauche ou droit) aux edges composant le triangle
        triangle.e1.setTriangle(triangle);
        triangle.e2.setTriangle(triangle);
        triangle.e3.setTriangle(triangle);
    }
    
    
    // Set les listes (pour effectuer des subdivisions successives)
    setListsBeforeLauchingAlgo()
    {
        this.vertice = this.kobbeltVertice;
        this.edges = this.kobbeltEdges;
        this.triangles = this.kobbeltTriangles;
        
        this.kobbeltVertice = [];
        this.kobbeltEdges = [];
        this.kobbeltTriangles = [];
        
    }
    
    computeKobbeltPoints()
    {   
        // Calcul des tous les face points
        for(var i = 0; i < this.triangles.length; ++i)
        {
            this.triangles[i].computeCenterPoint();
            this.pushKobbeltVertex(this.triangles[i].centerPoint);
        }
             
        // Calcul des tous les vertice points
        for(var i = 0; i < this.vertice.length; ++i)
        {
            this.vertice[i].computePerturbedPoint();
            this.pushKobbeltVertex(this.vertice[i].vertexPoint);
        }
    }
    
    linkTriangleCenterToTriangleVertice()
    {
        for(var i = 0; i < this.triangles.length; ++i)
        {
            var tmpTriangle = this.triangles[i];         
            var tmpCenterPoint = tmpTriangle.centerPoint;
            
            var tmpEdge = tmpTriangle.e1; 
            this.pushKobbeltTriangle(new Triangle(new Edge(tmpCenterPoint, tmpEdge.v1), new Edge(tmpCenterPoint, tmpEdge.v2), tmpEdge));
            
            tmpEdge = tmpTriangle.e2; 
            this.pushKobbeltTriangle(new Triangle(new Edge(tmpCenterPoint, tmpEdge.v1), new Edge(tmpCenterPoint, tmpEdge.v2), tmpEdge));
            
            tmpEdge = tmpTriangle.e3; 
            this.pushKobbeltTriangle(new Triangle(new Edge(tmpCenterPoint, tmpEdge.v1), new Edge(tmpCenterPoint, tmpEdge.v2), tmpEdge));
        }
    }
    
    getOriginalEdges()
    {
        var originalEdges = [];
        
        for(var i = 0; i < this.triangles.length; ++i)
        {
            var tmpTriangle = this.triangles[i];
            
            if(originalEdges.indexOf(tmpTriangle.e1) < 0)
                originalEdges.push(tmpTriangle.e1);
            
            if(originalEdges.indexOf(tmpTriangle.e2) < 0)
                originalEdges.push(tmpTriangle.e2);
            
            if(originalEdges.indexOf(tmpTriangle.e3) < 0)
                originalEdges.push(tmpTriangle.e3);
        }
        
        return originalEdges;
    }
    
    flipOriginalEdges()
    {
        var originalEdges = this.getOriginalEdges()
        for(var i = 0; i < originalEdges.length; ++i)
        {
            var tmpEdge = originalEdges[i];
            if(tmpEdge.hasLeftAndRightTriangle())
            {
                var tmpTriangle1 = tmpEdge.leftTriangle;
                var tmpTriangle2 = tmpEdge.rightTriangle;

                var tmpV1 = tmpEdge.v1;
                var tmpV2 = tmpEdge.v2;
                var tmpCentralPoint1 = tmpTriangle1.centerPoint;
                var tmpCentralPoint2 = tmpTriangle2.centerPoint;

                tmpTriangle1.setEdges(tmpCentralPoint1, tmpCentralPoint2, tmpV1);
                tmpTriangle2.setEdges(tmpCentralPoint1, tmpCentralPoint2, tmpV2);
            }
        }
    }
    /*
    setIncidentEdges()
    {
        for(var i = 0; i < this.kobbeltVertice.length; ++i)
        {
            this.kobbeltVertice[i].incidentEdges = [];
        }
        
        for(var i = 0; i < this.kobbeltTriangles.length; ++i)
        {
            var tmpTriangle = this.kobbeltTriangles[i];
            
            var tmpE1 = tmpTriangle.e1;
            tmpE1.v1.pushIncidentEdge(tmpE1);
            tmpE1.v2.pushIncidentEdge(tmpE1);
            var tmpE2 = tmpTriangle.e2;
            var tmpE3 = tmpTriangle.e3;
        }
    }
    */
    launchKobbelt()
    {
        this.setListsBeforeLauchingAlgo()
        
        this.computeKobbeltPoints();   
        
        this.linkTriangleCenterToTriangleVertice();
        
        this.flipOriginalEdges();
    }
}