import type { IndexedShape, Shape } from '../types';

/**
 * Expands quad faces to triangle vertices with interleaved position + normal.
 * Fan triangulation: quad [a,b,c,d] → triangles (a,c,b) and (a,d,c).
 * Output: 6 floats per vertex (pos.x, pos.y, pos.z, norm.x, norm.y, norm.z).
 */
export const expandFacesToTriangles = (
  shape: IndexedShape,
): Float32Array<ArrayBuffer> => {
  const { vertices, faces, normals } = shape;

  // Each face is an array of [vertexIndex, textureIndex, normalIndex] triples
  let totalTriangles = 0;
  for (const face of faces) {
    totalTriangles += face.length - 2;
  }

  const result = new Float32Array(totalTriangles * 3 * 6);
  let writeIdx = 0;

  const writeVertex = (posIdx: number, normIdx: number) => {
    const v = vertices[posIdx];
    const n = normals[normIdx];
    result[writeIdx++] = v.x;
    result[writeIdx++] = v.y;
    result[writeIdx++] = v.z;
    result[writeIdx++] = n.x;
    result[writeIdx++] = n.y;
    result[writeIdx++] = n.z;
  };

  for (const face of faces) {
    // Fan triangulation with reversed winding for CCW front face
    // face[i] is [vertexIdx, textureIdx, normalIdx]
    const [aPosIdx, , aNormIdx] = face[0];
    for (let i = 1; i < face.length - 1; i++) {
      const [bPosIdx, , bNormIdx] = face[i];
      const [cPosIdx, , cNormIdx] = face[i + 1];
      writeVertex(aPosIdx, aNormIdx);
      writeVertex(cPosIdx, cNormIdx);
      writeVertex(bPosIdx, bNormIdx);
    }
  }

  return result;
};

/**
 * Expands face indices to line-list vertices.
 * For each quad face, generates lines for the 4 edges.
 */
export const expandFacesToLines = (shape: Shape): Float32Array<ArrayBuffer> => {
  const { vertices, faces } = shape;

  const lineVertices: number[] = [];

  for (const face of faces) {
    for (let i = 0; i < face.length; i++) {
      const posIdx1 = face[i];
      const posIdx2 = face[(i + 1) % face.length];

      const vertex1 = vertices[posIdx1];
      const vertex2 = vertices[posIdx2];

      lineVertices.push(vertex1.x);
      lineVertices.push(vertex1.y);
      lineVertices.push(vertex1.z);

      lineVertices.push(vertex2.x);
      lineVertices.push(vertex2.y);
      lineVertices.push(vertex2.z);
    }
  }

  return Float32Array.from(lineVertices);
};
