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
        
    }
    
    // Lancer l'algo de subdivision Catmull-Clark
    launchCatmullClark()
    {
        this.computeCatmullClarkPoints();
        
        this.linkFacePointsToEdgePoints();
        
        var tmpVertex = null;
        var tmpIncidentEdges = null
        var tmpVertexPoint = null;
        
        for(var i = 0; i < this.vertice.length; ++i)
        {
            tmpVertex = this.vertice[i];
            tmpVertexPoint = tmpVertex.vertexPoint;  
            tmpIncidentEdges = tmpVertex.incidentEdges;
            
            this.catmullClarkVertice.push(tmpVertexPoint);
            
            // Création des edges du nouveau points
            for(var j = 0; j < this.tmpIncidentEdges.length; ++j)
            {
                tmpEdge = this.tmpIncidentEdges[j];
                tmpEdgePoint = tmpEdge.EdgePoint;
                
                newEdge = new Edge(tmpVertexPoint, tmpEdgePoint);
                
                this.catmullClarkEdges.push(newEdge);
                
                tmpVertexPoint.incidentEdges.push(newEdge);
                tmpEdgePoint.incidentEdges.push(newEdge);
            }            
        }
        
        var tmpPolygone = null;
        
        var tmpEdges = null;
        var tmpFacePoint = null;
        
        var tmpEdge1 = null;
        var tmpEdge2 = null;
        
        var tmpEdgePoint1 = null;
        var tmpEdgePoint2 = null;
        
        var tmpVertex = null;
        var tmpVertexPoint = null;
        var newPolygone = null;
        
        for(var i = 0; i < this.polygones.length; ++i)
        {
            tmpPolygone = this.polygones[i];
            tmpEdges = tmpPolygone.edges;
            tmpFacePoint = tmpPolygone.facePoint;
            
            for(var j = 0; j < tmpEdges.length; ++j)
            {
                tmpEdge1 = tmpEdges[j];
                
                tmpVertex = tmpEdge1.v1;
                tmpVertexPoint = tmpVertex.vertexPoint;
                
                for(var k = 0; k < tmpEdges.length; ++k)
                {
                    tmpEdge2 = tmpEdges[k];
                    if(tmpEdge1 != tmpEdge2)
                    {
                        if(tmpVertex == tmpEdge2.v1 || tmpVertex == tmpEdge2.v2)
                        {
                            
                            tmpEdgePoint1 = tmpEdge1.edgePoint;
                            tmpEdgePoint2 = tmpEdge2.edgePoint;
                            
                            tmpEdge1 = findEdge(tmpFacePoint, tmpEdgePoint1);
                            tmpEdge2 = findEdge(tmpEdgePoint1, tmpVertexPoint);
                            tmpEdge3 = findEdge(tmpVertexPoint, tmpEdgePoint2);
                            tmpEdge4 = findEdge(tmpEdgePoint2, tmpFacePoint);
                            
                            newPolygone = new Polygone(tmpEdge1, tmpEdge2, tmpEdge3, tmpEdge4);
                            
                            newPolygone.pushEdge(newPolygone);
                            // update left/rightface des edges du polygone
                        }
                    }
                }   
            }
        }
    }
}