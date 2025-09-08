// --- Vertex shader ---
const vertexShaderSrc = `
attribute vec2 a_position;
attribute vec2 a_texCoord;
varying vec2 v_texCoord;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_texCoord = vec2(a_texCoord.x, 1.0 - a_texCoord.y); // flip y
}
`;

// --- Fragment shader ---
const fragmentShaderSrc = `
precision mediump float;

uniform sampler2D u_image;
uniform float u_k;
uniform float u_S;
uniform vec2 u_center;
varying vec2 v_texCoord;

void main() {
  vec2 coord = v_texCoord - u_center;
  vec2 distorted = coord * (1.0 + u_k * dot(coord, coord)) * u_S + u_center;

  if (distorted.x < 0.0 || distorted.x > 1.0 ||
      distorted.y < 0.0 || distorted.y > 1.0) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  } else {
    gl_FragColor = texture2D(u_image, distorted);
  }
}
`;

// --- Shader helpers ---
function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) || "Shader compile failed");
  }
  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vs: string,
  fs: string
): WebGLProgram {
  const program = gl.createProgram()!;
  const vShader = createShader(gl, gl.VERTEX_SHADER, vs);
  const fShader = createShader(gl, gl.FRAGMENT_SHADER, fs);
  gl.attachShader(program, vShader);
  gl.attachShader(program, fShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) || "Program link failed");
  }
  return program;
}

// --- WebGL setup ---
const canvas = document.getElementById("distortionCanvas") as HTMLCanvasElement;
const gl = canvas.getContext("webgl")!;
const slider = document.getElementById("k") as HTMLInputElement;
const kVal = document.getElementById("kVal") as HTMLSpanElement;

const program = createProgram(gl, vertexShaderSrc, fragmentShaderSrc);
gl.useProgram(program);

const positionLoc = gl.getAttribLocation(program, "a_position");
const texCoordLoc = gl.getAttribLocation(program, "a_texCoord");
const uImageLoc = gl.getUniformLocation(program, "u_image");
const uKLoc = gl.getUniformLocation(program, "u_k");
const uSLoc = gl.getUniformLocation(program, "u_S");
const uCenterLoc = gl.getUniformLocation(program, "u_center");

// Fullscreen quad
const positionBuffer = gl.createBuffer()!;
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
  gl.STATIC_DRAW
);

const texCoordBuffer = gl.createBuffer()!;
gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]),
  gl.STATIC_DRAW
);

// Texture
const texture = gl.createTexture()!;
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

const img = new Image();
img.src = "/og/thumb.jpg"; // replace with your image
let cx = 0.5;
let cy = 0.5;
function computeS(
  k: number,
  cx: number,
  cy: number,
  samplesPerSide = 100
): number {
  if (k === 0) return 1;

  let S = Infinity;

  const points: [number, number][] = [];
  if (k > 0) {
    // Pincushion: sample midpoints along edges
    for (let i = 0; i <= samplesPerSide; i++) {
      const t = i / samplesPerSide;
      // top and bottom edges
      points.push([t, 0]);
      points.push([t, 1]);
      // left and right edges
      points.push([0, t]);
      points.push([1, t]);
    }
  } else {
    // Barrel: sample corners (could also sample along edges for finer fit)
    points.push([0, 0], [1, 0], [0, 1], [1, 1]);
  }

  for (const [px, py] of points) {
    const dx = px - cx;
    const dy = py - cy;
    const r2 = dx * dx + dy * dy;
    const factorX = Math.abs(dx) * (1 + k * r2);
    const factorY = Math.abs(dy) * (1 + k * r2);

    // maximum allowable distance to edges from center
    const maxX = dx > 0 ? 1 - cx : cx;
    const maxY = dy > 0 ? 1 - cy : cy;
    if (factorX !== 0) S = Math.min(S, maxX / factorX);
    if (factorY !== 0) S = Math.min(S, maxY / factorY);
  }

  return S;
}

img.onload = () => {
  canvas.width = img.width;
  canvas.height = img.height;
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  draw();
};

function draw() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.enableVertexAttribArray(positionLoc);
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.enableVertexAttribArray(texCoordLoc);
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

  const k = parseFloat(slider.value);
  const S = computeS(k, cx, cy); // <-- recompute S based on current center

  gl.uniform1f(uKLoc, k);
  gl.uniform1f(uSLoc, S);
  gl.uniform2f(uCenterLoc, cx, cy);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.uniform1i(uImageLoc, 0);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

// Slider control
slider.addEventListener("input", () => {
  kVal.textContent = parseFloat(slider.value).toFixed(2);
  draw();
});

const dot = document.getElementById("opticalCenter") as HTMLDivElement;
let isDragging = false;

dot.addEventListener("mousedown", () => (isDragging = true));
window.addEventListener("mouseup", () => (isDragging = false));
window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  const rect = canvas.getBoundingClientRect();
  const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
  const y = Math.min(Math.max(e.clientY - rect.top, 0), rect.height);

  dot.style.left = `${(x / rect.width) * 100}%`;
  dot.style.top = `${(y / rect.height) * 100}%`;

  // normalized coordinates for shader
  cx = x / rect.width;
  cy = y / rect.height; // invert y

  draw(); // redraw with new center & updated S
});
