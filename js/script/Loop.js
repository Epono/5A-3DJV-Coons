class Loop
{
    // Constructor
    constructor(vertice, edges, triangles)
    {
        this.vertice = [];
        this.edges = [];
        this.triangles = [];
        
        this.loopVertice = vertice;
        this.loopEdges = edges;
        this.loopTriangles = triangles;
    }
    

    
    // Recherche dans la liste des edges si un edge contenant les points passés en paramètres existe
    hasEdge(v1, v2)
    {
        // parcourt de chaque edges
        for(var i = 0; i < this.loopEdges.length; ++i)
        {
            var tmpEdge = this.loopEdges[i];

            // Comparaison des id des vertices
            if((v1.id == tmpEdge.v1.id && v2.id == tmpEdge.v2.id) || (v1.id == tmpEdge.v2.id && v2.id == tmpEdge.v1.id))
            //if((v1 === tmpEdge.v1 || v1 === tmpEdge.v2) && (v2 === tmpEdge.v1 || v2 === tmpEdge.v2))
            {
                return true;
            }
        }
        return false;
    }
    

    findEdge(v1, v2)
    {
        // parcourt de chaque edges
        for(var i = 0; i < this.loopEdges.length; ++i)
        {
            var tmpEdge = this.loopEdges[i];

            // Comparaison des id des vertices
            if((v1.id == tmpEdge.v1.id && v2.id == tmpEdge.v2.id) || (v1.id == tmpEdge.v2.id && v2.id == tmpEdge.v1.id))
            //if((v1 === tmpEdge.v1 || v1 === tmpEdge.v2) && (v2 === tmpEdge.v1 || v2 === tmpEdge.v2))
            {
                return tmpEdge;
            }
        }
        return null;
    }
    
    hasTriangle(edges)
    {
        var edgesFound = 0;
        var foundAnEdge = false;
        // parcourt de chaque triangle
        for(var i = 0; i < this.loopTriangles.length; ++i)
        {
            var tmpEdges = this.loopTriangles[i].getEdges;
            edgesFound = 0;
            foundAnEdge = false;
            
            if(edges.length == tmpEdges.length)
            {
                for(var j = 0; j < edges.length; ++j)
                {
                    for(var k = 0; k < tmpEdges.length; ++k)
                    {
                        if(edges[j].id == tmpEdges[k].id)
                        {
                            foundAnEdge = true;
                            break;
                        }
                    }
                    
                    if(foundAnEdge)
                    {
                        ++edgesFound;
                        foundAnEdge = false;
                    }
                    else
                        break;
                }
                
                if(edgesFound == edges.length)
                    return true;
            }
        }
        return false;
    }
    
    
    
    // Push un vertex dans la liste des nouveaux Vertex
    pushLoopVertex(vertex)
    {
        if(this.loopVertice.indexOf(vertex) < 0)
            this.loopVertice.push(vertex);
    }
    
    // Push l'edge dans la liste des nouvelles edges 
    // en settant les edges incidentes pour les vertice composant l'edge
    pushLoopEdge(edge)
    {
        if(this.hasEdge(edge.v1, edge.v2) == false)
        {
            this.loopEdges.push(edge);
            // Ajout de l'edge adjacente aux vertice de l'edge
            edge.v1.incidentEdges.push(edge);
            edge.v2.incidentEdges.push(edge);
        }
    }
    
    // Push le triangle dans la liste des nouveaux triangles 
    // en settant le triangle gauche ou droit des edges composant le triangle
    pushLoopTriangle(triangle)
    {
        if(this.hasTriangle(triangle.getEdges()) == false)
        {
            this.loopTriangles.push(triangle);
            // Ajout du triangle (gauche ou droit) aux edges composant le triangle
            triangle.e1.setTriangle(triangle);
            triangle.e2.setTriangle(triangle);
            triangle.e3.setTriangle(triangle);
        }
    }
    
    
    // Set les listes (pour effectuer des subdivisions successives)
    setListsBeforeLauchingAlgo()
    {
        this.vertice = this.loopVertice;
        this.edges = this.loopEdges;
        this.triangles = this.loopTriangles;
        
        this.loopVertice = [];
        this.loopEdges = [];
        this.loopTriangles = [];
        
    }
    
    computeLoopPoints()
    {   
        // Calcul des tous les vertice points
        for(var i = 0; i < this.vertice.length; ++i)
        {
            this.vertice[i].computeVertexPointLoop();
            this.pushLoopVertex(this.vertice[i].vertexPoint);
        }
        
        // Calcul des tous les face points
        for(var i = 0; i < this.edges.length; ++i)
        {
            this.edges[i].computeEdgePointLoop();
            this.pushLoopVertex(this.edges[i].edgePoint);
        }
        
    }
    

    launchLoop()
    {
        this.setListsBeforeLauchingAlgo()
        
        this.computeLoopPoints();   
        
        for(var i = 0; i < this.triangles.length; ++i)
        {
            var tmpTriangle = this.triangles[i];
            
            var verticeTriangle = tmpTriangle.getVertice();
            
            var v1 = verticeTriangle[0].vertexPoint;
            var v2 = verticeTriangle[1].vertexPoint;
            var v3 = verticeTriangle[2].vertexPoint;
            
            var e3 = tmpTriangle.e1.edgePoint;
            var e1 = tmpTriangle.e2.edgePoint;
            var e2 = tmpTriangle.e3.edgePoint;
            
            //t0
            var e1e2 = new Edge(e1, e2);
            var e2e3 = new Edge(e2, e3);
            var e3e1 = new Edge(e3, e1);

            this.pushLoopEdge(e1e2);
            this.pushLoopEdge(e2e3);
            this.pushLoopEdge(e3e1);
            
            this.pushLoopTriangle(new Triangle(e1e2, e2e3, e3e1));
            
            //t1
            var v1e3 = new Edge(v1, e3);
            //var e2e3 = new Edge(e2, e3);
            var e2v1 = new Edge(e2, v1);
            
            this.pushLoopEdge(v1e3);
            this.pushLoopEdge(e2v1);
            
            this.pushLoopTriangle(new Triangle(v1e3, e2e3, e2v1));
            
            //t2
            var e3v2 = new Edge(e3, v2);
            var v2e1 = new Edge(v2, e1);
            //var e3e1 = new Edge(e3, e1);
            
            this.pushLoopEdge(e3v2);
            this.pushLoopEdge(v2e1);
            
            this.pushLoopTriangle(new Triangle(e3v2, v2e1, e3e1));
            
            //t3
            var e1v3 = new Edge(e1, v3);
            var v3e2 = new Edge(v3, e2);
            //var e1e2 = new Edge(e1, e2);
            
            this.pushLoopEdge(e1v3);
            this.pushLoopEdge(v3e2);
            
            this.pushLoopTriangle(new Triangle(e1v3, v3e2, e1e2));
        }
        
        return Mesh.withTriangle(this.loopTriangles);
    }
}