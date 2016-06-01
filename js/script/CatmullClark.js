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
        
        this.
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
    
    
    // Lancer l'algo de subdivision Catmull-Clark
    launchAlgo()
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
        
        var tmpFace = null;
        var tmpEdges = null;
        var tmpFacePoint = null;
        var tmpEdgePoint = null;
        
        // Parcout de toutes les faces pour lier le face point aux edge point de chaque edge de la face
        for(var i = 0; i < this.polygones.length; ++i)
        {
            tmpFace = this.polygones[i];
            tmpFacePoint = tmpFace.facePoint;
            
            this.catmullClarkVertice.push(tmpFacePoint);
            
            tmpEdges = this.polygones[i].edges;
            for(var j = 0; j < tmpEdges.length; ++j)
            {
                tmpEdgePoint = tmpEdges[j].edgePoint;
                
                this.catmullClarkVertice.push(tmpEdgePoint);
                
                this.catmullClarkEdges.push(new Edge(tmpFacePoint, tmpEdgePoint));
            }           
        }
    }
}