class Mesh
{
	constructor(polygones)
	{
        this.polygones = polygones || []; 
        this.edges = polygones && polygones.edges ? polygones.edges : []; 
        this.edgesMap = {
        	// key (Edge.toKey()) : value (Edge)
        };

        for (var e = 0; e < this.edges.length; ++e)
        {
        	this.edgesMap[this.edges.toKey()] = this.edges[e];
        }

	}

	static withTriangle(triangles)
	{

		var polygones = [];

		for (var i = 0; i < triangles.length; ++i)
		{
			var nextPoly = new Polygone();

			nextPoly.pushEdge(
				triangles[i].e1
			);
			nextPoly.pushEdge(
				triangles[i].e2
			);
			nextPoly.pushEdge(
				triangles[i].e3
			);
			
			polygones.push(nextPoly);
		}

		return new Mesh(polygones);
	}

	pushPolygoneAsVertices(vertices)
	{
		var incPoly = new Polygone();

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

			//*
			var exitingEdge = this.edgesMap[nextEdge.toKey()];

			if ( exitingEdge )
			{
				incPoly.pushEdge(exitingEdge);

				exitingEdge.setPolygone(incPoly);
			}
			else
			{
				this.edgesMap[nextEdge.toKey()] = nextEdge;
				this.edges.push(nextEdge);

				incPoly.pushEdge(nextEdge);

				nextEdge.setPolygone(incPoly);
			}
			//*/

			//incPoly.pushEdge(nextEdge);
		}

		this.pushPolygone(incPoly);
		//this.defineEdgesNeighbourhood();
	}

	// C DE LA MERDE
	defineEdgesNeighbourhood()
	{
		var edgesInfos = this.getPolygonesEdgesInfos();

		for (var i = 0; i < edgesInfos.length; ++i)
		{
			for (var j = i + 1; j < edgesInfos.length; ++j)
			{
				if (
					edgesInfos[i].edge.equals(edgesInfos[j].edge) &&
					edgesInfos[i].owner.id != edgesInfos[j].owner.id
				)
				{
					console.log("Ok");
					edgesInfos[i].edge.setPolygone(edgesInfos[j].owner);
					edgesInfos[j].edge.setPolygone(edgesInfos[i].owner);

				}
			}
		}

		for (var i = 0; i < edgesInfos.length; ++i)
		{

			console.log(
				"edgesInfos [" + (i < 10 ? i+ " " : i )+ "] = " +
				(edgesInfos[i].edge.rightPolygone != null) + " | " +
				(edgesInfos[i].edge.leftPolygone != null)
			);
		}
	}
	
	getPolygonesEdgesInfos()
	{
		var res = [];

		for (var p = 0; p < this.polygones.length; ++p)
		{
			for (var e = 0; e < this.polygones[p].edges.length; ++e)
			{
				res.push(
					{
						edge : this.polygones[p].edges[e],
						owner : this.polygones[p]
					}
				);
			}
		}

		return res;
	}

	pushPolygone(poly)
	{
		this.polygones.push(poly);
	}

	getEdges()
	{
		var res = [];

		for (var i = 0; i < this.polygones.length; ++i)
		{
			for (var j = 0; j < this.polygones[i].edges.length; ++j)
			{
				res.push(this.polygones[i].edges[j]);
			}	
		}

		return res;
	}

	getVertice()
	{
		var res = [];

		for (var i = 0; i < this.polygones.length; ++i)
		{
			var vertice = this.polygones[i].getUniqueVertices();
			for (var j = 0; j < vertice.length; ++j)
			{
				res.push(vertice[j]);
			}
		}

		return res;
	}

	/*<THREE.Mesh>*/ buildThreeMesh(mat = Mesh.DEFAULT_MAT )
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

	/*<THREE.Mesh>*/ buildThreeMesh2(mat = Mesh.DEFAULT_MAT)
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

			this.polygones[p].computeFacePoint();

			var centerOfVertices = this.polygones[p].facePoint;

			
			var refInfo = {
				index : -1,
				vector : null
			};

			vertices.push(centerOfVertices);

			// TODO : Continue HERE !

			verticesMap[centerOfVertices.toKey()]
			

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

	/*<List<Vertex>> sortPolygoneVertice (polygone)
	{

		var centerVertex = polygone.computeFacePoint().facePoint,
			v1 = polygone.vertices[0],
			norm = centerVertex.cross(v1);



		float Utils::determinant2D(const Point& v1, const Point& v2)
		{

			return ( (v1.getX() * v2.getY()) - (v2.getX() * v1.getY()) );
		}

		float Utils::getAngle2D(const Point& v1, const Point& v2)
		{
			return acos((dotProduct2D(v1, v2)) / (norm2D(v1) * norm2D(v2)));
		}

		float Utils::getOrientedAngle2D(const Point& v1, const Point& v2)
		{
			float angle = getAngle2D(v1, v2);

			if (determinant2D(v1, v2) > 0)
				return angle;
			else
				return (static_cast<float>((2 * M_PI)) - angle);
		}

	}
	*/

	static getRandomColorMat()
	{
		var color = new THREE.Color(Math.random(), Math.random(), Math.random());

		return new THREE.MeshBasicMaterial( 
			{
				color: color,
				//side : THREE.BackSide,
				side : THREE.DoubleSide
			} 
		);
	}

	static getCubeMesh(cubeSize)
	{
		var customCubeVertices = [
      		new Vertex( -1 * cubeSize, 1 * cubeSize, 1 * cubeSize ),
			new Vertex(  1 * cubeSize, 1 * cubeSize, 1 * cubeSize ),
			new Vertex(  1 * cubeSize, 1 * cubeSize,-1 * cubeSize ),
			new Vertex( -1 * cubeSize, 1 * cubeSize,-1 * cubeSize ),

			new Vertex( -1 * cubeSize, -1 * cubeSize, 1 * cubeSize ),
			new Vertex(  1 * cubeSize, -1 * cubeSize, 1 * cubeSize ),
			new Vertex(  1 * cubeSize, -1 * cubeSize,-1 * cubeSize ),
			new Vertex( -1 * cubeSize, -1 * cubeSize,-1 * cubeSize )
      	];

	    
	    var cubeMesh = new Mesh();

		cubeMesh.pushPolygoneAsVertices(
			[
				customCubeVertices[0],
				customCubeVertices[1],
				customCubeVertices[2],
				customCubeVertices[3]
			]
		);

	    cubeMesh.pushPolygoneAsVertices(
			[
				customCubeVertices[1],
				customCubeVertices[5],
				customCubeVertices[6],
				customCubeVertices[2]
			]
		);

	    cubeMesh.pushPolygoneAsVertices(
			[
				customCubeVertices[0],
				customCubeVertices[4],
				customCubeVertices[5],
				customCubeVertices[1]
			]
		);

		cubeMesh.pushPolygoneAsVertices(
			[
				customCubeVertices[4],
				customCubeVertices[0],
				customCubeVertices[3],
				customCubeVertices[7]
			]
		);

		cubeMesh.pushPolygoneAsVertices(
			[
				customCubeVertices[5],
				customCubeVertices[4],
				customCubeVertices[7],
				customCubeVertices[6]
			]
		);

		cubeMesh.pushPolygoneAsVertices(
			[
				customCubeVertices[3],
				customCubeVertices[2],
				customCubeVertices[6],
				customCubeVertices[7]
			]
		);

		return cubeMesh;
	}

}

Mesh.DEFAULT_MAT = new THREE.MeshBasicMaterial( 
	{
		color: 0xFF0000,
		//wireframe : true,
		//side : THREE.BackSide,
		side : THREE.DoubleSide
	} 
);


/* build three mesh BACKUP

buildThreeMesh(mat = Mesh.DEFAULT_MAT )
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


				// Anti clockwize face ordrering

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
			
			}// end of FOR curr vertices

		} // end of FOR polygones

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
*/



/*

float Utils::determinant2D(const Point& v1, const Point& v2)
{
	return ( (v1.getX() * v2.getY()) - (v2.getX() * v1.getY()) );
}

float Utils::getAngle2D(const Point& v1, const Point& v2)
{
	return acos((dotProduct2D(v1, v2)) / (norm2D(v1) * norm2D(v2)));
}

float Utils::getOrientedAngle2D(const Point& v1, const Point& v2)
{
	float angle = getAngle2D(v1, v2);

	if (determinant2D(v1, v2) > 0)
		return angle;
	else
		return (static_cast<float>((2 * M_PI)) - angle);
}

*/