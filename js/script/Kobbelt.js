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
    
    // Recherche dans la liste des edges si un edge contenant les points passés en paramètres existe
    hasEdge(v1, v2)
    {
        // parcourt de chaque edges
        for(var i = 0; i < this.kobbeltEdges.length; ++i)
        {
            var tmpEdge = this.kobbeltEdges[i];

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
        for(var i = 0; i < this.kobbeltEdges.length; ++i)
        {
            var tmpEdge = this.kobbeltEdges[i];

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
        for(var i = 0; i < this.kobbeltTriangles.length; ++i)
        {
            var tmpEdges = this.kobbeltTriangles[i].getEdges;
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
    pushKobbeltVertex(vertex)
    {
        if(this.kobbeltVertice.indexOf(vertex) < 0)
            this.kobbeltVertice.push(vertex);
    }
    
    // Push l'edge dans la liste des nouvelles edges 
    // en settant les edges incidentes pour les vertice composant l'edge
    pushKobbeltEdge(edge)
    {
        if(this.hasEdge(edge.v1, edge.v2) == false)
        {
            this.kobbeltEdges.push(edge);
            // Ajout de l'edge adjacente aux vertice de l'edge
            edge.v1.incidentEdges.push(edge);
            edge.v2.incidentEdges.push(edge);
        }
    }
    
    // Push le triangle dans la liste des nouveaux triangles 
    // en settant le triangle gauche ou droit des edges composant le triangle
    pushKobbeltTriangle(triangle)
    {
        if(this.hasTriangle(triangle.getEdges()) == false)
        {
            this.kobbeltTriangles.push(triangle);
            // Ajout du triangle (gauche ou droit) aux edges composant le triangle
            triangle.e1.setTriangle(triangle);
            triangle.e2.setTriangle(triangle);
            triangle.e3.setTriangle(triangle);
        }
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
            if(this.triangles[i].centerPoint != null)
                this.pushKobbeltVertex(this.triangles[i].centerPoint);
        }

        // Calcul des tous les vertice points
        for(var i = 0; i < this.vertice.length; ++i)
        {
            this.vertice[i].computePerturbedPoint();
            if(this.vertice[i].vertexPoint != null)
                this.pushKobbeltVertex(this.vertice[i]);
        }
    }
    
    linkTriangleCenterToTriangleVertice()
    {
        for(var i = 0; i < this.triangles.length; ++i)
        {
            var tmpTriangle = this.triangles[i];         
            var tmpCenterPoint = tmpTriangle.centerPoint;
            
            var tmpEdge = tmpTriangle.e1;
            var newEdge1 = new Edge(tmpCenterPoint, tmpEdge.v1);
            var newEdge2 = new Edge(tmpCenterPoint, tmpEdge.v2);
            
            this.pushKobbeltEdge(tmpEdge);
            this.pushKobbeltEdge(newEdge1);
            this.pushKobbeltEdge(newEdge2);
            this.pushKobbeltTriangle(new Triangle(newEdge1, newEdge2, tmpEdge));
            
            
            
            tmpEdge = tmpTriangle.e2; 
            newEdge1 = new Edge(tmpCenterPoint, tmpEdge.v1);
            newEdge2 = new Edge(tmpCenterPoint, tmpEdge.v2);
            
            this.pushKobbeltEdge(tmpEdge);
            this.pushKobbeltEdge(newEdge1);
            this.pushKobbeltEdge(newEdge2);
            this.pushKobbeltTriangle(new Triangle(newEdge1, newEdge2, tmpEdge));
            
            
            
            tmpEdge = tmpTriangle.e3; 
            newEdge1 = new Edge(tmpCenterPoint, tmpEdge.v1);
            newEdge2 = new Edge(tmpCenterPoint, tmpEdge.v2);
            
            this.pushKobbeltEdge(tmpEdge);
            this.pushKobbeltEdge(newEdge1);
            this.pushKobbeltEdge(newEdge2);
            this.pushKobbeltTriangle(new Triangle(newEdge1, newEdge2, tmpEdge));
        }
    }
    
    hasEdgeInEdges(v1, v2, edges)
    {
        // parcourt de chaque edges
        for(var i = 0; i < this.edges.length; ++i)
        {
            var tmpEdge = this.edges[i];

            // Comparaison des id des vertices
            if((v1.id == tmpEdge.v1.id && v2.id == tmpEdge.v2.id) || (v1.id == tmpEdge.v2.id && v2.id == tmpEdge.v1.id))
            //if((v1 === tmpEdge.v1 || v1 === tmpEdge.v2) && (v2 === tmpEdge.v1 || v2 === tmpEdge.v2))
            {
                return true;
            }
        }
        return false;
    }
    
    flipOriginalEdges()
    {
        for(var i = 0; i < this.edges.length; ++i)
        {
            var tmpEdge = this.edges[i];
            if(tmpEdge.hasLeftAndRightTriangle())
            {
                var tmpTriangle1 = tmpEdge.leftTriangle;
                var tmpTriangle2 = tmpEdge.rightTriangle;

                var tmpV1 = tmpEdge.v1;
                var tmpV2 = tmpEdge.v2;
                
                var tmpCentralPoint1 = tmpTriangle1.centerPoint;
                var tmpCentralPoint2 = tmpTriangle2.centerPoint;
                
                if(tmpCentralPoint1 != null && tmpCentralPoint2!= null)
                {
                    var edgeToFlip = this.findEdge(tmpV1, tmpV2);

                    if(edgeToFlip != null)
                    {
                        edgeToFlip.v1.removeIncidentEdge(edgeToFlip);
                        edgeToFlip.v2.removeIncidentEdge(edgeToFlip);

                        edgeToFlip.setV1V2(tmpCentralPoint1, tmpCentralPoint2);

                        edgeToFlip.v1.pushIncidentEdge(edgeToFlip);
                        edgeToFlip.v2.pushIncidentEdge(edgeToFlip);
                    }
                    else
                        console.log("cc");
                }
                else
                    console.log("bb");
            }
            else
                console.log("aa");
        }
    }

    launchKobbelt()
    {   
        this.setListsBeforeLauchingAlgo()
        
        this.computeKobbeltPoints();   
        
        this.linkTriangleCenterToTriangleVertice();
        
        this.flipOriginalEdges();

        return  Mesh.withTriangle(this.kobbeltTriangles);
    }
}