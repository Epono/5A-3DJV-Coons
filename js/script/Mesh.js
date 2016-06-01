class Mesh
{
	constructor(polygones)
	{
        this.polygones = polygones || [];  
	}

	pushPolygoneAsVertices(vertices)
	{
		var poly = new Polygone();

		for (var i = 0; i < vertices.length; ++i)
		{

			var nextEdge;

			if (i + 1 < vertices.length)
			{
				nextEdge = new Edge(
					vertices[i],
					vertices[i + 1]
				);
			}
			// Last
			else
			{
				nextEdge = new Edge(
					vertices[i],
					vertices[0]
				);
			}

			poly.pushEdge(nextEdge);
		}

		this.pushPolygone(poly);
	}

	pushPolygone(poly)
	{
		this.polygones.push(poly);
	}

	/*<THREE.Mesh>*/ buildThreeMesh(mat = Mesh.DEFAULT_MAT)
	{
		var verticesMap = {};


		for (var p = 0; p < this.polygones.length; ++p)
		{
			if (this.polygones[i].edges.length < 3)
			{
				console.error("Cannot run 'buildThreeMesh'. Polygone has " + this.polygones[i].edges.length + " edges. 3 a least expected");
				return;
			}

			


		}

	}

	
	/*
	THREE.Mesh( 
			geometry, 
			new THREE.MeshBasicMaterial( 
				{
					color: 0xFF33FF,
					side : THREE.BackSide,
					//side : THREE.DoubleSide
				} 
			)
		);
	*/
}

Mesh.DEFAULT_MAT = new THREE.MeshBasicMaterial( 
	{
		color: 0xFF33FF,
		side : THREE.BackSide,
		//side : THREE.DoubleSide
	} 
);
