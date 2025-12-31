export const vertexShader = `\
struct Uniforms {
  transformMatrix: mat4x4<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

// Project the 3D point onto the XY-plane (perspective projection)
fn project(pos: vec3<f32>) -> vec2<f32> {
    return vec2<f32>(pos.x / pos.z, pos.y / pos.z);
}

// Convert projected coordinates to clip space
// z is set to 0.5 (middle of depth range), w is 1.0 (already perspective-divided)
fn screen(ndc: vec2<f32>) -> vec4<f32> {
    return vec4<f32>(ndc.x, ndc.y, 0.5, 1.0);
}

@vertex
fn vs_main(@location(0) position: vec3<f32>) -> @builtin(position) vec4<f32> {
    let transformed = uniforms.transformMatrix * vec4<f32>(position, 1.0);
    let projected = project(transformed.xyz);
    return screen(projected);
}`;

export const fragmentShader = `\
struct FragmentUniforms {
  color: vec4<f32>,
}

@group(0) @binding(1) var<uniform> fragUniforms: FragmentUniforms;

@fragment
fn fs_main() -> @location(0) vec4<f32> {
    return fragUniforms.color;
}`;
