import type { Shape } from '../types';

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

      // Copy vertex 1 position
      const vertex1 = vertices[posIdx1];
      const vertex2 = vertices[posIdx2];

      lineVertices.push(vertex1.x);
      lineVertices.push(vertex1.y);
      lineVertices.push(vertex1.z);

      // Copy vertex 2 position
      lineVertices.push(vertex2.x);
      lineVertices.push(vertex2.y);
      lineVertices.push(vertex2.z);
    }
  }

  return Float32Array.from(lineVertices);
};
