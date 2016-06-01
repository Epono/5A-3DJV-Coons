class Polygone
{
    // Constructeur
	constructor()
	{
        this.edges = [];  
        this.id = ++Polygone.ID;
        this.facePoint = null;
	}
    
    
    // Setter
    setEdges(edges)
    {
        this.edges = edges;
    }
    
    
    // Ajoute une edge à la liste des edges
    pushEdge(edge)
    {
        this.edges.push(edge);
    }
    
    // Enlève un point à la liste des points (s'il le point passé en paramètre se trouve dans la liste)
    removeEdges(edge)
    {
        // Récupération de l'index de l'élément à enlever
        var indexToRemove = this.edges.indexOf(edge);
        
        // Si l'élément se trouve dans la liste
        // On recrée une nouvelle liste sans l'élément à retirer (plus rapide en JS)
        if(indexToRemove != -1) 
        {
            var tmpEdges = [];
            
            for(i = 0; i < this.edges.length; ++i)
            {
                if(i != indexToRemove)
                    tmpEdges.push(this.edges[i]);
            }
            
            this.edges = tmpEdges;
        }
    }
    
        
    // Calcul le facePoint du polygone (Catmull-Clark)
    computeFacePoint()
    {
        var tmpVertice = [];
        
        // On récupère tous les vertices des edges composant le polygone
        var arrayLength = this.edges.length;
        
        for(var i = 0; i < arrayLength; ++i)
        {
            if(tmpVertice.indexOf(this.edges.v1) == -1)
                tmpVertice = this.edges.v1;
            
            if(tmpVertice.indexOf(this.edges.v2) == -1)
                tmpVertice = this.edges.v2;
        }
        
        // On calcule la moyenne des différents vertices appartenant aux edges composant le polygone
        var arrayLength = tmpVertice.length;
        if(arrayLength > 0)
        {
            this.facePoint = tmpVertice[0].clone();
            for(i = 1; i < arrayLength; ++i)
                this.facePoint.add(tmpVertice[i]);

            this.facePoint.divideScalar(arrayLength);
        }
    }

    getUniqueVertices()
    {
        var res = [],
            map = {};
        
        for(var i = 0, len = this.edges.length; i < len; ++i)
        {
            if (!map[this.edges[i].v1.toKey()])
            {
                res.push(this.edges[i].v1);
                map[this.edges[i].v1.toKey()] = true;
            }

            if (!map[this.edges[i].v2.toKey()])
            {
                res.push(this.edges[i].v2);
                map[this.edges[i].v2.toKey()] = true;
                
            }
        }

        return res;
    }
}

Polygone.ID = 0;