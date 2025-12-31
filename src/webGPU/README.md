## WebGPU Renderer

This is a WebGPU based renderer that currently supports `line-list` based wireframe drawing. It is essentially a black-box for the purpose of this exercise.

The key differences, between out canvas-2d and webGPU rendering pipelines:

- canvas-2d applies matrix transformations to vertices sequentially
- WebGPU pipeline applies matrix transformations to vertices in parallel using a vertex shader

WebGPU API is quite verbose, and most of the code in this directory is equivalent to plumbing. The useful bits to explore:

- `../canvasWebGPU.ts`: accepts the `shape` to initialize the rendering pipeline, accepts a transformation matrix to pass to the vertex shader

- `shader/wireframe.ts::vertexShader`: applies transformation matrix to the points in parallel
