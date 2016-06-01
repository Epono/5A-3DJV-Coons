class Edge
{
    // Constructeur prenant en paramètre les 2 vertice le composant
	constructor(v1, v2)
	{
        this.v1 = v1;
        this.v2 = v2;
        this.id = ++Edge.ID;
        // Pour Catmull-Clark
        this.leftPolygone = null;
        this.rightPolygone = null;
        
        // Pour les autres Algos de subdivision
        this.leftTriangle = null;
        this.rightTriangle = null;

        this.edgePoint = null;
	}
    
    
    // Setter
    setV1(v)
    {
        this.v1 = v;
    } 
    setV2(v)
    {
        this.v2 = v;
    }
    
    setLeftPolygone(polygone)
    {
        this.leftPolygone = polygone;
    }   
    setRightPolygone(polygone)
    {
        this.rightPolygone = polygone;
    }
    
    setLeftTriangle(triangle)
    {
        this.leftTriangle = triangle;
    } 
    setRightTriangle(triangle)
    {
        this.rightTriangle = triangle
    }
    
    
    setPolygone(polygone)
    {
        if((this.leftPolygone == null) && (this.rightPolygone != polygone))
                this.leftPolygone = polygone;
        else if((this.rightPolygone == null) && (this.leftPolygone != polygone))
            this.rightPolygone = polygone;
    }
    
    setTriangle(triangle)
    {
        if((this.leftTriangle == null) && (this.rightTriangle != triangle))
                this.rightTriangle = triangle;
        else if((this.rightTriangle == null) && (this.leftTriangle != triangle))
            this.rightTriangle = triangle;
    }
    
    // Dit s'il y a un polyone gauche et droit
    hasLeftAndRightPolygone()
    {
        if((this.leftPolygone != null) && (this.rightPolygone != null))
            return true;
        return false;
    }
    
    // Dit s'il y a un triangle gauche et droit
    hasLeftAndRightPolygone()
    {
        if((this.leftTriangle != null) && (this.rightTriangle != null))
            return true;
        return false;
    }
    
    hasTwoVertice()
    {
        if((this.v1 != null) && (this.v2 != null))
            return true;
        return false;
    }
    
    // Calcul de l'edge point (pour Catmull-Clark)
    computeEdgePoint()
    {
        // Vérification s'il y a bien un polygone à gauche et à droite de l'edge
        if(this.hasLeftAndRightPolygone() && this.hasTwoVertice)
        {
            // Calcule de l'edge point en faisant la moyenne entre
            // les deux vertice de l'edge et les deux face points des faces gauche et droite
            // (v1 + v2 + fpg + fpd)/4
            this.edgePoint = this.v1.clone();
            this.edgePoint.add(this.v2);
            this.edgePoint.add(this.leftPolygone.facePoint);
            this.edgePoint.add(this.rightPolygone.facePoint);
            
            this.edgePoint.divideScalar(4);
        }
    }

    equals(edge)
    {
        return this.v1.equals(edge.v1) && this.v2.equals(edge.v2);
    }
}

Edge.ID = 0;