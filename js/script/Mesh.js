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
		var verticesMap = {
			// key : vertex.toKey() , value : index in 'vertices' list 
			},
			vertices = [],
			facesParam = [
			// { indexes : [] , vectors : [] }
			];


		for (var p = 0; p < this.polygones.length; ++p)
		{
			if (this.polygones[p].edges.length < 3)
			{
				console.error("Cannot run 'buildThreeMesh'. Polygone has " + this.polygones[p].edges.length + " edges. 3 a least expected");
				return;
			}

			var currVectices = this.polygones[p].getUniqueVertices();
			
			var refInfo = {
				index : -1,
				vector : null
			};

			if (verticesMap[currVectices[0].toKey()])
			{
				refInfo.index = verticesMap[currVectices[0].toKey()];
				refInfo.vector = vertices[refInfo.index];
			}
			else
			{
				vertices.push(currVectices[0]);

				verticesMap[currVectices[0].toKey()] = vertices.length -1;
				
				refInfo.index = vertices.length -1;
				refInfo.vector = currVectices[0];
			}

			for (var i = 1; i + 1< currVectices.length; ++i)
			{
				var currFaceParam = {
					indexes : [],
					vectors : []
				};


				/* Anti clockwize face ordrering */

				// Point 1 : ref point
				currFaceParam.indexes.push(refInfo.index);
				currFaceParam.vectors.push(refInfo.vector);

				// Point 2 :
				if (verticesMap[currVectices[i+1].toKey()])
				{

					currFaceParam.indexes.push(
						
						verticesMap[currVectices[i+1].toKey()]
						
					);

					currFaceParam.vectors.push(currVectices[i+1]);
				}
				else
				{
					vertices.push(currVectices[i+1]);

					verticesMap[currVectices[i+1].toKey()] = vertices.length - 1;

					currFaceParam.indexes.push(
						vertices.length - 1
					);

					currFaceParam.vectors.push(currVectices[i+1]);
				}

				// Point 3 :
				if (verticesMap[currVectices[i].toKey()])
				{

					currFaceParam.indexes.push(
						
						verticesMap[currVectices[i].toKey()]
						
					);

					currFaceParam.vectors.push(currVectices[i]);
				}
				else
				{
					vertices.push(currVectices[i]);

					verticesMap[currVectices[i].toKey()] = vertices.length - 1;

					currFaceParam.indexes.push(
						vertices.length - 1
					);

					currFaceParam.vectors.push(currVectices[i]);
				}

				facesParam.push(currFaceParam);
				
			}/* end of FOR curr vertices*/

		} /* end of FOR polygones */

		var geometry = new THREE.Geometry(),
			threeFaces = [];

		for (var i = 0; i < facesParam.length; ++i)
		{
			threeFaces.push(
				new THREE.Face3(
					facesParam[i].indexes[0], 
					facesParam[i].indexes[1],
					facesParam[i].indexes[2]
				)
			);
		}

		geometry.vertices = vertices;
		geometry.faces = threeFaces;

		return new THREE.Mesh( 
			geometry, 
			mat
		);
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
		color: 0xFF0000,
		side : THREE.BackSide,
		//side : THREE.DoubleSide
	} 
);
