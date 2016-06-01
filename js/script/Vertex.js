class Vertex extends THREE.Vector3
{
    // Constructeur avec des coordonnées x, y, z en paramètres
	constructor(x, y, z)
    {
        super(x, y, z);
        
        this.id = ++Vertex.ID;
        this.incidentEdges = [];
        
        this.vertexPoint = null;
    }
    
    
    // Setter
    setIncidentEdges(incidentEdges)
    {
        this.incidentEdges = incidentEdges;
    }
    
    
    // Ajouter une arrete à la liste des arretes incidentes
    pushIncidentEdges(edge)
    {
        this.incidentEdges.push(edge);
    }
    
    // Enlève une arrete incidente passée en paramètres (s'il elle se trouve dans la liste)
    removeIncidentEdges(edge)
    {
        // Récupération de l'index de l'élément à enlever
        var indexToRemove = this.incidentEdges.indexOf(edge);
        
        // Si l'élément se trouve dans la liste
        // On recrée une nouvelle liste sans l'élément à retirer (plus rapide en JS)
        if(indexToRemove != -1) 
        {
            var tmpEdges = [];
            
            for(i = 0; i < this.incidentEdges.length; ++i)
            {
                if(i != indexToRemove)
                    tmpEdges.push(this.incidentEdges[i]);
            }
            
            this.incidentEdges = tmpEdges;
        }
    }
    
    // Calcul du Vertex Point (Catmull-Clark)
    computeVertexPoint()
    {      
        var allFacePoints = [];
        var allMidPoints = [];

        var tmpEdge = null;
        var tmpVertex = null;

        // Récupération de tous les face points et mid points pour le vertex
        for(var i = 0; i < this.incidentEdges.length; ++i)
        {
            // Récupération de l'edge incidente courante
            tmpEdge = this.incidentEdges[i];
            // Calcul du point au milieu de l'edge ((v1 + v2)/2)
            tmpVertex = tmpEdge.v1.clone();
            tmpVertex.add(tmpEdge.v2);
            tmpVertex.divideScalar(2);
            // Ajout de ce point dans la liste des mid-points
            allMidPoints.push(tmpVertice);

            // Ajout des face points pour l'edge incidente courante 
            // dans la liste des face points des faces gauche et droite 
            // s'il n'existe pas déjà dans la liste
            if(allFacePoints.indexOf(tmpEdge.leftPolygone.facePoint) == -1)
                allFacePoints.push(tmpEdge.leftPolygone.facePoint);
            if(allFacePoints.indexOf(tmpEdge.rightPolygone.facePoint) == -1)
                allFacePoints.push(tmpEdge.rightPolygone.facePoint);
        }
      
        // Variable qui serviront au calcul du vertex point
        var q = allFacePoints[0].clone;
        var r = allMidPoints[0].clone;
        var v = super.clone();
        var n = this.incidentEdges.length;
             
        // Moyenne de tous les faces points
        var arrayLength = allFacePoints.length;
        for(var i = 1; i < arrayLength; ++i)
        {
            q.add(allFacePoints[i]);
        }
        q.divideScalar(arrayLength);
        
        // Moyenne de tous les mid points
        arrayLength = allMidPoints.length;
        for(var i = 1; i < arrayLength; ++i)
        {
            r.add(allMidPoints[i]);
        }
        r.divideScalar(arrayLength);
        
        
        // Calcul du vertex point
        // (1/n)*Q + (2/n)R + ((n-3)/n)*v
        this.vertexPoint = q.multiplyScalar(1/n);
        this.vertexPoint.add(r.multiplyScalar(2/n));
        this.vertexPoint.add(v.multiplyScalar((n-3)/n));
    }

    toKey()
    {
        return ("" + this.x + this.y + this.z).replace('[.]', '');
    }
}


Vertex.ID = 0;