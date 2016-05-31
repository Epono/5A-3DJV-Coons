class Triangle
{
    // Constructor
	constructor(e1, e2, e3)
    {
        this.e1 = e1;
        this.e2 = e2;
        this.e3 = e3;
        
        this.facePoint = null;
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
        var v1 = this.e1.getV1();
        var v2 = this.e1.getV2();
        var v3 = null;
        
        if((v1 != this.e2.getV1()) && (v2 != this.e2.getV1()))
            v3 = this.e2.getV1();
        else
            v3 = this.e2.getV2();
        
        this.facePoint.add(v1);
        this.facePoint.add(v2);
        this.facePoint.add(v3);
        
        this.facePoint.divideScalar(3);
        
    }  
}