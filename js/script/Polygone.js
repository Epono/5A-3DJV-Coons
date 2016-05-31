class Polygone
{
    // Constructeur
	constructor()
	{
        this.vertice = [];        
        this.facePoint = null;
	}
    
    
    // Setter
    setVertice(vectice)
    {
        this.vertice = vertice;
        
        this.computeFacePoint();
    }
    
    
    // Calcul le facePoint du polygone
    computeFacePoint()
    {
        var verticeLength = this.vertice.length;

        this.facePoint = this.vertice[0];
        
        for(i = 1; i < verticeLength; ++i)
            this.facePoint.add(this.vertice[i]);
        
        this.facePoint.divideScalar(verticeLength);
    }
    
    // Ajoute un point à la liste des points
    pushVertex(v)
    {
        this.vertice.push(v);
        
        this.computeFacePoint();
    }
    
    // Enlève un point à la liste des points (s'il le point passé en paramètre se trouve dans la liste)
    removeVertex(v)
    {
        var indexToRemove = this.vertice.indexOf(v);
        
        if(indexToRemove != -1) 
        {
            var tmpVertice = [];
            
            for(i = 0; i < this.vertice.length; ++i)
            {
                if(i != indexToRemove)
                    tmpVertice.push(this.vertice[i]);
            }
            
            this.vertice = tmpVertice;
            
            this.computeFacePoint();
        }
    }
}