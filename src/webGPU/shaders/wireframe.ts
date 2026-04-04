export const vertexShader = `\
struct Uniforms {
  mvpMatrix: mat4x4<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@vertex
fn vs_main(@location(0) position: vec3<f32>) -> @builtin(position) vec4<f32> {
    return uniforms.mvpMatrix * vec4<f32>(position, 1.0);
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
