class CatmullClark
{
    // Constructor
    constructor(vertice, edges, polygones)
    {
        this.vertice = [];
        this.edges = [];
        this.polygones = [];
        
        this.catmullClarkVertice = vertice;
        this.catmullClarkEdges = edges;
        this.catmullClarkPolygones = polygones;
    }
    
    
    // Setter
    setVertice(vertice)
    {
        this.vertice = vertice;
        this.catmullClarkVertice = vertice;
    } 
    setEdges(edges)
    {
        this.edges = edges;
        this.catmullClarkEdges = edges;
    } 
    setPolygones(polygones)
    {
        this.polygones = polygones;
        this.catmullClarkPolygones = polygones;    
    }
    

    // Recherche dans la liste des edges si un edge contenant les points passés en paramètres existe
    hasEdge(v1, v2)
    {
        // parcourt de chaque edges
        for(var i = 0; i < this.catmullClarkEdges.length; ++i)
        {
            var tmpEdge = this.catmullClarkEdges[i];

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
        for(var i = 0; i < this.catmullClarkEdges.length; ++i)
        {
            var tmpEdge = this.catmullClarkEdges[i];

            // Comparaison des id des vertices
            if((v1.id == tmpEdge.v1.id && v2.id == tmpEdge.v2.id) || (v1.id == tmpEdge.v2.id && v2.id == tmpEdge.v1.id))
            //if((v1 === tmpEdge.v1 || v1 === tmpEdge.v2) && (v2 === tmpEdge.v1 || v2 === tmpEdge.v2))
            {
                return tmpEdge;
            }
        }
        return null;
    }
    
    hasPolygone(edges)
    {
        var edgesFound = 0;
        var foundAnEdge = false;
        // parcourt de chaque polygone
        for(var i = 0; i < this.catmullClarkPolygones.length; ++i)
        {
            var tmpEdges = this.catmullClarkPolygones[i].edges;
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
                        ++edgesFound;
                    else
                        break;
                }
                
                if(edgesFound == edges.length)
                    return true;
            }
        }
        return false;
    }
    
    // Set les listes (pour effectuer des subdivisions successives)
    setListsBeforeLauchingAlgo()
    {
        this.vertice = this.catmullClarkVertice;
        this.edges = this.catmullClarkEdges;
        this.polygones = this.catmullClarkPolygones;
        
        this.catmullClarkVertice = [];
        this.catmullClarkEdges = [];
        this.catmullClarkPolygones = [];
    }
    
    // Push un vertex dans la liste des nouveaux Vertex
    pushCatmullClarkVertex(vertex)
    {
        if(this.catmullClarkVertice.indexOf(vertex) < 0)
            this.catmullClarkVertice.push(vertex);
    }
    
    // Push l'edge dans la liste des nouvelles edges 
    // en settant les edges incidentes pour les vertice composant l'edge
    pushCatmullClarkEdge(edge)
    {
        this.catmullClarkEdges.push(edge);
        // Ajout de l'edge adjacente aux vertice de l'edge
        edge.v1.incidentEdges.push(edge);
        edge.v2.incidentEdges.push(edge);
    }
    
    // Push le polygone dans la liste des nouveaux polygones 
    // en settant le polygone gauche ou droit des edges composant le polygone
    pushCatmullClarkPolygone(polygone)
    {
        this.catmullClarkPolygones.push(polygone);

        // Ajout du polygone (gauche ou droit) aux edges composant le polygone
        var edges = polygone.edges;
        for(var i = 0; i < edges.length; ++i)
            edges[i].setPolygone(polygone);
    }
    
        // Calcul de tous les face/edge/vertex points
    computeCatmullClarkPoints()
    {   
        // Calcul des tous les face points
        for(var i = 0; i < this.polygones.length; ++i)
        {
            this.polygones[i].computeFacePoint();
            this.pushCatmullClarkVertex(this.polygones[i].facePoint);
        }
        
        // Calcul des tous les edge points
        for(var i = 0; i < this.edges.length; ++i)
        {
            this.edges[i].computeEdgePoint();
            this.pushCatmullClarkVertex(this.edges[i].edgePoint);
        }
        
        // Calcul des tous les vertice points
        for(var i = 0; i < this.vertice.length; ++i)
        {
            this.vertice[i].computeVertexPoint();
            this.pushCatmullClarkVertex(this.vertice[i].vertexPoint);
        }
    }
    
    
    // Lie les faces points de chaque polygone
    // au edge points de chaque edge composant le polygone courant
    linkFacePointsToEdgePoints()
    {
        // Parcourt de toutes les faces pour lier le face point des faces aux edge points de chaque edge de la face
        for(var i = 0; i < this.polygones.length; ++i)
        {
            var tmpFacePoint = this.polygones[i].facePoint;            
            var tmpEdges = this.polygones[i].edges;
            
            // Parcout des edges du polygone pour ajouter les edgesPoints et les nouvelles edges
            for(var j = 0; j < tmpEdges.length; ++j)
            {
                // Ajout de l'edge point dans la liste des vertice
                var tmpEdgePoint = tmpEdges[j].edgePoint;

                // Ajout de la nouvelle edge (facePoint --------- EdgePoint)
                if(this.hasEdge(tmpFacePoint, tmpEdgePoint) == false)
                {
                    this.pushCatmullClarkEdge(new Edge(tmpFacePoint, tmpEdgePoint));
                }
            }           
        }
    }
    
    // Lie les vertex points à chaque edge points des edges incidents du vertex
    linkVertexPointsToEdgePoints()
    {
        // Parcourt de tous les vertice
        for(var i = 0; i < this.vertice.length; ++i)
        {
            var tmpVertex = this.vertice[i];  
            
            var tmpVertexPoint = tmpVertex.vertexPoint;  
            var tmpIncidentEdges = tmpVertex.incidentEdges;
            
            // Création des edges du nouveau points
            for(var j = 0; j < tmpIncidentEdges.length; ++j)
            {
                var tmpEdgePoint = tmpIncidentEdges[j].edgePoint;
                
                // Ajout de la nouvelle edge (vertexPoint --------- edgePoint)
                if(this.hasEdge(tmpVertexPoint, tmpEdgePoint) == false)
                {
                    this.pushCatmullClarkEdge(new Edge(tmpVertexPoint, tmpEdgePoint));
                }
            }
        }
    }

    // Ajout les polygones dans la liste des polygones pour selon un polygone
    //      facePoint        -->     Face point d'un polygone
    //      polygoneEdges    -->     Edges d'un polygone
    //      polygoneEdge1    -->     Une des edges de polygoneEdges
    //      vertex           -->     Un des deux vertex de polygoneEdge1 
    findEdgesToPushCatmullClarkPolygones(facePoint, polygoneEdges, polygoneEdge1, vertex)
    {    
        // Vertex point d'un des vertice appartenant au polygoneEdge1 
        var vertexPoint = vertex.vertexPoint;
        
        // Parcout de toute les edges du polygone
        // pour recherche l'autre edge ayant en commun le meme point 'vertex'
        for(var i = 0; i < polygoneEdges.length; ++i)
        {
            var polygoneEdge2 = polygoneEdges[i];
            
            // Test pour voir s'il ne s'agit pas de la meme edge
            if(polygoneEdge1.id != polygoneEdge2.id)
            //if(polygoneEdge1 !== polygoneEdge2)
            {
                // Test pour voir si les edges ont bien 'vertex' en commun dans les vertice les composant
                if((vertex.id == polygoneEdge2.v1.id) || (vertex.id == polygoneEdge2.v2.id))
                //if((vertex === polygoneEdge2.v1) || (vertex === polygoneEdge2.v2))
                {   
                    // Edge point 1 et 2
                    var edgePoint1 = polygoneEdge1.edgePoint;
                    var edgePoint2 = polygoneEdge2.edgePoint;

                    // Le polygone est forcement dans cet ordre de point ()
                    var edge1 = this.findEdge(facePoint, edgePoint1);
                    var edge2 = this.findEdge(edgePoint1, vertexPoint);
                    var edge3 = this.findEdge(vertexPoint, edgePoint2);
                    var edge4 = this.findEdge(edgePoint2, facePoint);

                    // Test pour voir si on a bien récupérer toutes les edges
                    if((edge1 != null) && (edge2 != null) && (edge3 != null) && (edge4 != null))
                    {
                        // Test pour voir si un polygone composé des 4 edges n'existe pas deja
                        if(this.hasPolygone([edge1, edge2, edge3, edge4]) == false)
                        {
                            // Ajout du nouveau polygone dans la liste des polygones
                            var newPolygone = new Polygone();
                            newPolygone.setEdges([edge1, edge2, edge3, edge4]);
                            this.pushCatmullClarkPolygone(newPolygone);
                        }
                        break;
                    }
                }
            }
        }
    }

    
    // Parcourt de toute les faces pour créer les polygones
    generateCatmullClarkPolygones()
    {        
        // Parcourt de tous les polygones
        for(var i = 0; i < this.polygones.length; ++i)
        {
            var tmpPolygone = this.polygones[i];
            var tmpPolygoneEdges = tmpPolygone.edges;
            var tmpPolygoneFacePoint = tmpPolygone.facePoint;
  
            // Parcourt de toutes les edges du polygone
            for(var j = 0; j < tmpPolygoneEdges.length; ++j)
            {
                var tmpPolygoneEdge = tmpPolygoneEdges[j];
                
                // Essaye de crée le polygone avec le vertex point du 1er et 2ème vertex du l'edge courante
                this.findEdgesToPushCatmullClarkPolygones(tmpPolygoneFacePoint, tmpPolygoneEdges, tmpPolygoneEdge, tmpPolygoneEdge.v1);
                this.findEdgesToPushCatmullClarkPolygones(tmpPolygoneFacePoint, tmpPolygoneEdges, tmpPolygoneEdge, tmpPolygoneEdge.v2);
            }
        }
    }
    
    
    // Lancer l'algo de subdivision Catmull-Clark
    launchCatmullClark()
    {
        
        this.setListsBeforeLauchingAlgo();
        
        this.computeCatmullClarkPoints();
        
        this.linkFacePointsToEdgePoints();
        
        this.linkVertexPointsToEdgePoints();
        
        this.generateCatmullClarkPolygones();        
        
        return new Mesh(this.catmullClarkPolygones);
        
    }
}