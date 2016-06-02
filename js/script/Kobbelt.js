class Kobbelt
{
    // Constructor
    constructor(vertice, edges, polygones)
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
        this.triangles = polygones;
        this.kobbeltTriangles = polygones;    
    }
    
    
    // Set les listes (pour effectuer des subdivisions successives)
    setListsBeforeLauchingAlgo()
    {
        this.vertice = this.catmullClarkVertice;
        this.edges = this.catmullClarkEdges;
        this.polygones = this.catmullClarkPolygones;
        
        this.kobbeltVertice = [];
        this.kobbeltEdges = [];
        this.kobbeltTriangles = [];
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
    
    // Push le polygone dans la liste des nouveaux polygones 
    // en settant le polygone gauche ou droit des edges composant le polygone
    pushKobbeltTriangle(triangle)
    {
        this.kobbeltTriangles.push(triangle);

        // Ajout du polygone (gauche ou droit) aux edges composant le polygone
        var edges = triangles.getEdges;
        for(var i = 0; i < edges.length; ++i)
            edges[i].setTriangle(triangle);
    }
}