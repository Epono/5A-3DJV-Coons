class Triangle
{
    // Constructor avec les 3 edges composant le triangle
	constructor(e1, e2, e3)
    {
        this.id = ++Triangle.ID;
        
        this.e1 = e1;
        this.e2 = e2;
        this.e3 = e3;
        
        this.facePoint = null;
        
        this.computeFacePoint();
    }

    
    // Setter
    setE1(edge)
    {
        this.e1 = edge;
        this.computeFacePoint();
    }
    setE2(edge)
    {
        this.e2 = edge;
        this.computeFacePoint();
    }

    setE3(edge)
    {
        this.e3 = edge;
        this.computeFacePoint();
    }
    
    
    // Calcul le facePoint
    computeFacePoint()
    {
        // Récupération des 3 vertice composant le triangle
        var v1 = this.e1.v1;
        var v2 = this.e1.v2;
        var v3 = null;
        // Les deux premiers sommets se trouvent sur la première edge du triangle, 
        // dont pour avoir le troisième vertex
        // sur la deuxième edge du triangle, on va récupérer le vertex différent de v1 et v2
        if((v1 != this.e2.v1) && (v2 != this.e2.v1))
            v3 = this.e2.v1;
        else
            v3 = this.e2.v2;
        
        // Calcul du face point en faisant le moyenne avec les 3 vertices
        // (v1 + v2 + v3)/3
        this.facePoint = v1.clone();
        this.facePoint.add(v2);
        this.facePoint.add(v3);
        
        this.facePoint.divideScalar(3);
        
    }  
}

Triangle.ID = 0;