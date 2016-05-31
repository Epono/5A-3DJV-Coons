class Edge
{
    // Constructeur
	constructor(v1, v2)
	{
        this.v1 = v1;
        this.v2 = v2;
        
        this.leftPolygone = null;
        this.rightPolygone = null;
        
        this.leftTriangle = null;
        this.rightTriangle = null;
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
}