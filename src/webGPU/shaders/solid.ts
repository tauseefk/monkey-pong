export const solidVertexShader = `\
struct Uniforms {
  mvpMatrix: mat4x4<f32>,
  modelMatrix: mat4x4<f32>,
}

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) normal: vec3<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@vertex
fn vs_main(
  @location(0) position: vec3<f32>,
  @location(1) normal: vec3<f32>
) -> VertexOutput {
    var output: VertexOutput;
    output.position = uniforms.mvpMatrix * vec4<f32>(position, 1.0);
    let worldNormal = (uniforms.modelMatrix * vec4<f32>(normal, 0.0)).xyz;
    output.normal = normalize(worldNormal);
    return output;
}`;

export const solidFragmentShader = `\
struct FragmentUniforms {
  color: vec4<f32>,
  lightDirection: vec3<f32>,
}

@group(0) @binding(1) var<uniform> fragUniforms: FragmentUniforms;

const AMBIENT: f32 = 0.2;
const DIFFUSE_STRENGTH: f32 = 0.6;

@fragment
fn fs_main(@location(0) normal: vec3<f32>) -> @location(0) vec4<f32> {
    let n = normalize(normal);
    let lightDir = normalize(fragUniforms.lightDirection);
    let diffuse = max(dot(n, lightDir), 0.0);
    let brightness = AMBIENT + DIFFUSE_STRENGTH * diffuse;
    let finalColor = vec3<f32>(
        fragUniforms.color.r * brightness,
        fragUniforms.color.g * brightness,
        fragUniforms.color.b * brightness
    );
    return vec4<f32>(finalColor, fragUniforms.color.a);
}`;
