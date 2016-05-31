class Vertex extends THREE.Vector3
{
    // Constructor
	constructor(x, y, z)
    {
        super(x, y, z);
        
        this.adjacentEdges = [];
    }
    
    
    // Setter
    setAdjacentEdges(adjacentEdges)
    {
        this.adjacentEdges = adjacentEdges;
    }
    
    
    // Ajouter une arrete à la liste des arretes adjacentes
    pushAdjacentEdge(edge)
    {
        this.adjacentEdges.push(edge);
        
        this.computeFacePoint();
    }
    
    // Enlève une arrete adjacente passée en paramètres (s'il elle se trouve dans la liste)
    removeAdjacentEdge(edge)
    {
        var indexToRemove = this.adjacentEdges.indexOf(edge);
        
        if(indexToRemove != -1) 
        {
            var tmpEdges = [];
            
            for(i = 0; i < this.adjacentEdges.length; ++i)
            {
                if(i != indexToRemove)
                    tmpEdges.push(this.adjacentEdges[i]);
            }
            
            this.adjacentEdges = tmpEdges;
            
            this.computeFacePoint();
        }
    }
}