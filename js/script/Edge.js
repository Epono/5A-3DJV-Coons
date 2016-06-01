class Edge
{
    // Constructeur prenant en paramètre les 2 vertice le composant
	constructor(v1, v2)
	{
        this.id = ++Edge.ID;
        
        this.v1 = v1;
        this.v2 = v2;
        
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
    
    // Affect le polygone en paramètre au left ou right polygone
    // On affect le polygone à gauche ou à droite 
    // si il n'y a rien sur un des coté et si de l'autre coté le polygone n'existe pas deja
    setPolygone( polygone )
    {

        if (!this.rightPolygone && !this.leftPolygone)
        {
            this.rightPolygone = polygone;
        }
        else if (!this.leftPolygone && polygone.id != this.rightPolygone.id)
        {
           this.leftPolygone = polygone;
        }

    }
    
    // Affect le triangle en paramètre au left ou right polygone
    // On affect le triangle à gauche ou à droite 
    // si il n'y a rien sur un des coté et si de l'autre coté le triangle n'existe pas deja
    setTriangle(triangle)
    {
        if((this.leftTriangle == null) && (this.rightTriangle.id != triangle.id))
                this.rightTriangle = triangle;
        else if((this.rightTriangle == null) && (this.leftTriangle.id != triangle.id))
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
    
    // Dit si l'edge est bien composé de 2 vertice
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
            // Calcul de l'edge point en faisant la moyenne entre
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
        return ((this.v1.equals(edge.v1) && this.v2.equals(edge.v2)) || (this.v1.equals(edge.v2) && this.v2.equals(edge.v1)));
    }

    toKey()
    {
        var k1 = this.v1.toKey(),
            k2 = this.v2.toKey();

        return k1 > k2 ? k1 + k2 : k2 + k1;
    }
}

Edge.ID = 0;