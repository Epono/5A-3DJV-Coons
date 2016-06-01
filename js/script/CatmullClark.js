class CatmullClark
{
    // Constructor
    constructor(vertice, edges, polygones)
    {
        this.vertice = vertice;
        this.edges = edges;
        this.polygones = polygones;
        
        this.catmullClarkVertice = [];
        this.catmullClarkEdges = [];
        this.catmullClarkPolygones = [];
    }
    
    
    // Setter
    setVertice(vertice)
    {
        this.vertice = vertice;
    } 
    setEdges(edges)
    {
        this.edges = edges;
    } 
    setVertice(polygones)
    {
        this.polygones = polygones;
        
    }
    
    computeCatmullClarkPoints()
    {
        // Calcul des tous les face points
        for(var i = 0; i < this.polygones.length; ++i)
            this.polygones[i].computeFacePoint();
        
        // Calcul des tous les edge points
        for(var i = 0; i < this.edges.length; ++i)
            this.edges[i].computeEdgePoint();
        
        // Calcul des tous les vertice points
        for(var i = 0; i < this.vertice.length; ++i)
            this.vertice[i].computeVertexPoint();
    }
    
    pushCatmullClarkVertex(vertex)
    {
        this.catmullClarkVertice.push(vertex);
    }
    
    pushCatmullClarkEdge(edge)
    {
        this.catmullClarkEdges.push(edge);
        
        // Ajout de l'edge adjacente aux vertice de l'edge
        edge.v1.adjacentEdges.(edge);
        edge.v2.adjacentEdges.(edge);
    }
    
    pushCatmullClarkPolygone(polygone)
    {
        this.catmullClarkPolygones.push(polygone);
        
        // Ajout du polygone (gauche ou droit) aux edges composant le polygone
        var edges = this.polygones.edges;
        for(var i = 0; i < edges.length; ++i)
            edges[i].setPolygone(polygone);
    }
    
    linkFacePointsToEdgePoints()
    {
        var tmpFacePoint = null;
        var tmpEdges = null;
        
        var tmpEdgePoint = null;
        
        var newEdge = null;
        
        // Parcout de toutes les faces pour lier le face point aux edge point de chaque edge de la face
        for(var i = 0; i < this.polygones.length; ++i)
        {
            tmpFacePoint = this.polygones[i].facePoint;            
            tmpEdges = this.polygones[i].edges;
            
            this.catmullClarkVertice.push(tmpFacePoint);
            
            // Parcout des edges du polygone pour ajouter les edgesPoints et les nouvelles edges
            for(var j = 0; j < tmpEdges.length; ++j)
            {
                tmpEdgePoint = tmpEdges[j].edgePoint;
                this.catmullClarkVertice.push(tmpEdgePoint);  
                
                newEdge = new Edge(tmpFacePoint, tmpEdgePoint);
                this.catmullClarkEdges.push(newEdge);
            }           
        }
    }
    
    linkVertexPointsToEdgePoints()
    {
        var tmpVertex = null;
        var tmpIncidentEdges = null
        var tmpVertexPoint = null;
        
        var tmpEdgePoint = null;
        var newEdge = null;
        

        for(var i = 0; i < this.vertice.length; ++i)
        {
            tmpVertex = this.vertice[i];      
            tmpVertexPoint = tmpVertex.vertexPoint;  
            tmpIncidentEdges = tmpVertex.incidentEdges;
            
            this.catmullClarkVertice.push(tmpVertexPoint);
            
            // Création des edges du nouveau points
            for(var j = 0; j < tmpIncidentEdges.length; ++j)
            {
                tmpEdgePoint = tmpIncidentEdges[j].EdgePoint;
                
                newEdge = new Edge(tmpVertexPoint, tmpEdgePoint);
                this.catmullClarkEdges.push(newEdge);
            }            
        }
    }
    
    findEdge(v1, v2)
    {
        var tmpEdge = null;
        for(var i = 0; i < this.catmullClarkEdges.length; ++i)
        {
            tmpEdge = this.catmullClarkEdges[i];
            if((tmpEdge.v1 == v1 || tmpEdge.v2 == v1) && (tmpEdge.v1 == v2 || tmpEdge.v2 == v2))
                return tmpEdge;
        }
        return null;
    }
    
    hasPolygone(edge1, edge2, edge3, edge4)
    {
        var tmpPlygone = null:
        var tmpEdges = null;
        
        var tmpEdge = null;
        
        var hasEdge = true;
        
        var arrayLength = 0;
        
        for(var i = 0; i < this.catmullClarkPolygones.length; ++i)
        {
            tmpPolygone = this.catmullClarkPolygones[i];
            tmpEdges = tmpPolygone.edges;
            arrayLength = tmpEdges.length;
            
            if(arrayLength == 4)
            {
                hasEdge = true;
                
                for(var j = 0; j < tmpEdges.length; ++j)
                {
                    tmpEdge = tmpEdges[j];
                    if(tmpEdge != edge1 || tmpEdge != edge2 || tmpEdge != edge3 || tmpEdge != edge4)
                    {
                        hasEdge = false;
                    }
                }
                
                if(hasAllEdges)
                    return true;
            }
        }
        return false;
    }
    
    findEdgesToPushCatmullClarkPolygone(facePoint, polygoneEdges, polygoneEdge1, vertex)
    {
        var polygoneEdge2 = null;  
        
        var edgePoint1 = null;
        var edgePoint2 = null;
        
        var edge1 = null; 
        var edge2 = null; 
        var edge3 = null; 
        var edge4 = null; 
        
        var vertexPoint = vertex.vertexPoint;
        
        for(var i = 0; i < polygoneEdges.length; ++i)
        {
            // Edge 2
            polygoneEdge2 = polygoneEdges[i];
            
            if(polygoneEdge1 != polygoneEdge2)
            {
                if(vertex == polygoneEdge2.v1 || vertex == polygoneEdge2.v2)
                {   
                    // Edge point 1 et 2
                    edgePoint1 = polygoneEdge1.edgePoint;
                    edgePoint2 = polygoneEdge2.edgePoint;

                    edge1 = findEdge(facePoint, edgePoint1);
                    edge2 = findEdge(edgePoint1, vertexPoint);
                    edge3 = findEdge(vertexPoint, edgePoint2);
                    edge4 = findEdge(edgePoint2, facePoint);

                    if(edge1 != null && edge2 != null && edge3 != null && edge4 != null)
                    {
                        if(this.hasPolygone(edge1, edge2, edge3, edge4)
                        {
                            newPolygone = new Polygone(edge1, edge2, edge3, edge4);
                            pushCatmullClarkPolygone(newPolygone);
                        }
                        break;
                    }
                }
            }
        }
    }
    
    generateCatmullClarkPolygones()
    {
        var tmpPolygone = null;
        var tmpPolygoneEdges = null;
        var tmpPolygoneFacePoint = null;
        
        for(var i = 0; i < this.polygones.length; ++i)
        {
            tmpPolygone = this.polygones[i];
            tmpPolygoneEdges = tmpPolygone.edges;
            tmpPolygoneFacePoint = tmpPolygone.facePoint;
            
            for(var j = 0; j < tmpPolygoneEdges.length; ++j)
            {
                tmpPolygoneEdge1 = tmpPolygoneEdges[j];
                
                this.findEdgesToPushCatmullClarkPolygones(tmpPolygoneFacePoint, tmpPolygoneEdges, tmpPolygoneEdge1, tmpPolygoneEdge1.v1);
                this.findEdgesToPushCatmullClarkPolygones(tmpPolygoneFacePoint, tmpPolygoneEdges, tmpPolygoneEdge1, tmpPolygoneEdge1.v2);
            }
        }
    }
    
    // Lancer l'algo de subdivision Catmull-Clark
    launchCatmullClark()
    {
        this.computeCatmullClarkPoints();
        
        this.linkFacePointsToEdgePoints();
        
        this.linkVertexPointsToEdgePoints();
        
        this.generateCatmullClarkPolygones();  
    }
}