// --- Shader sources ---
const vertexShaderSrc = `
attribute vec2 a_position;
attribute vec2 a_texCoord;
varying vec2 v_texCoord;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_texCoord = vec2(a_texCoord.x, 1.0 - a_texCoord.y);
}
`;

const fragmentShaderSrc = `
precision mediump float;

uniform sampler2D u_image;
uniform vec2 u_center;
uniform float u_k1;
uniform float u_k2;
uniform float u_k3;
uniform float u_S;

varying vec2 v_texCoord;

void main() {
  vec2 coord = v_texCoord - u_center;
  float r2 = dot(coord, coord);
  float radial = 1.0 + u_k1 * r2 + u_k2 * r2 * r2 + u_k3 * r2 * r2 * r2;
  vec2 distorted = coord * radial * u_S + u_center;

  if (distorted.x < 0.0 || distorted.x > 1.0 || distorted.y < 0.0 || distorted.y > 1.0) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  } else {
    gl_FragColor = texture2D(u_image, distorted);
  }
}
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) || "Shader compile error");
  }
  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vsSrc: string,
  fsSrc: string
) {
  const vs = createShader(gl, gl.VERTEX_SHADER, vsSrc);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSrc);
  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) || "Program link error");
  }
  return program;
}

const canvas = document.getElementById("afterImage") as HTMLCanvasElement;
const gl = canvas.getContext("webgl")!;
if (!gl) throw new Error("WebGL not supported");
// gl.viewport(0, 0, canvas.width, canvas.height);

const program = createProgram(gl, vertexShaderSrc, fragmentShaderSrc);
gl.useProgram(program);

// Quad positions
const positionLoc = gl.getAttribLocation(program, "a_position");
const texCoordLoc = gl.getAttribLocation(program, "a_texCoord");

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
  gl.STATIC_DRAW
);

const texCoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]),
  gl.STATIC_DRAW
);

// Uniforms
const uImageLoc = gl.getUniformLocation(program, "u_image");
const uCenterLoc = gl.getUniformLocation(program, "u_center");
const uK1Loc = gl.getUniformLocation(program, "u_k1");
const uK2Loc = gl.getUniformLocation(program, "u_k2");
const uK3Loc = gl.getUniformLocation(program, "u_k3");
const uSLoc = gl.getUniformLocation(program, "u_S");

// --- CENTRALIZED PARAMETERS ---
const params = {
  cx: 0.5,
  cy: 0.5,
  k1: 0,
  k2: 0,
  k3: 0,
  S: 1,
};

function draw() {
  computeScale();
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.enableVertexAttribArray(positionLoc);
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.enableVertexAttribArray(texCoordLoc);
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

  gl.uniform2f(uCenterLoc, params.cx, params.cy);
  gl.uniform1f(uK1Loc, params.k1);
  gl.uniform1f(uK2Loc, params.k2);
  gl.uniform1f(uK3Loc, params.k3);
  gl.uniform1f(uSLoc, params.S);

  gl.activeTexture(gl.TEXTURE0);
  gl.uniform1i(uImageLoc, 0);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function computeScale(samplesPerSide = 100) {
  const points: [number, number][] = [];
  for (let i = 0; i <= samplesPerSide; i++) {
    const t = i / samplesPerSide;
    // top and bottom edges
    points.push([t, 0]);
    points.push([t, 1]);
    // left and right edges
    points.push([0, t]);
    points.push([1, t]);
  }

  let maxScale = -Infinity;
  for (const [x, y] of points) {
    const dx = x - params.cx;
    const dy = y - params.cy;
    const r2 = dx * dx + dy * dy;
    const radial =
      1 + params.k1 * r2 + params.k2 * r2 * r2 + params.k3 * r2 * r2 * r2;

    const xDist = dx * radial;
    const yDist = dy * radial;

    // allowable S so the point stays in [0,1]
    const sx = dx < 0 ? params.cx / xDist : (1 - params.cx) / xDist;
    const sy = dy < 0 ? params.cy / yDist : (1 - params.cy) / yDist;

    const s = Math.min(sx, sy);
    if (!isNaN(s) && isFinite(s)) maxScale = Math.max(maxScale, s);
  }

  params.S = maxScale;
}

// --- UI HOOKUP ---
const sliders = [
  { id: "k1", key: "k1" },
  { id: "k2", key: "k2" },
  { id: "k3", key: "k3" },
];

sliders.forEach(({ id, key }) => {
  const input = document.getElementById(id) as HTMLInputElement;
  const span = document.getElementById(id + "Val")!;
  input.addEventListener("input", () => {
    params[key as keyof typeof params] = parseFloat(input.value);
    span.textContent = parseFloat(input.value).toFixed(3);
    draw();
    drawReverseGrid();
  });
});

// --- GRID OVERLAY ---
const gridCanvas = document.getElementById("afterGrid") as HTMLCanvasElement;
const ctx = gridCanvas.getContext("2d")!;

function resizeGrid() {
  gridCanvas.width = canvas.clientWidth;
  gridCanvas.height = canvas.clientHeight;
  drawGrid();
}

const toggleGrid = document.getElementById("toggleGrid") as HTMLInputElement;
toggleGrid.addEventListener("change", () => {
  gridCanvas.style.display = toggleGrid.checked ? "block" : "none";
  if (toggleGrid.checked) drawGrid();
});

function drawGrid() {
  ctx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
  ctx.strokeStyle = "rgba(0,255,0,0.8)";
  ctx.lineWidth = 1;

  const spacing = 40; // px in screen space
  for (let x = 0; x <= gridCanvas.width; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, gridCanvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= gridCanvas.height; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(gridCanvas.width, y);
    ctx.stroke();
  }

  drawReverseGrid();
}

let aspectRatio: number;

// Keep grid responsive
window.addEventListener("resize", resizeGrid);

// --- REVERSE GRID ---
const sourceImg = document.getElementById("sourceImage") as HTMLImageElement;
const reverseGridCanvas = document.getElementById(
  "beforeGrid"
) as HTMLCanvasElement;
const rctx = reverseGridCanvas.getContext("2d")!;

function resizeReverseGrid() {
  reverseGridCanvas.width = sourceImg.clientWidth;
  reverseGridCanvas.height = sourceImg.clientHeight;
  drawReverseGrid();
}
window.addEventListener("resize", resizeReverseGrid);

function distortPoint(x: number, y: number): [number, number] {
  const dx = x - params.cx;
  const dy = y - params.cy;
  const r2 = dx * dx + dy * dy;
  const radial =
    1 + params.k1 * r2 + params.k2 * r2 * r2 + params.k3 * r2 * r2 * r2;

  const xDist = dx * radial;
  const yDist = dy * radial;

  return [params.cx + params.S * xDist, params.cy + params.S * yDist];
}

function drawReverseGrid() {
  if (!rctx) return;
  rctx.clearRect(0, 0, reverseGridCanvas.width, reverseGridCanvas.height);
  rctx.strokeStyle = "rgba(0,255,0,0.8)";
  rctx.lineWidth = 1;

  const spacing = 40;
  const w = reverseGridCanvas.width;
  const h = reverseGridCanvas.height;
  const nx = 20;
  const ny = 20;

  for (let x = 0; x <= w; x += spacing) {
    rctx.beginPath();
    for (let i = 0; i <= ny; i++) {
      const y = (i / ny) * h;
      const u = x / w;
      const v = y / h;
      const [dx, dy] = distortPoint(u, v);
      rctx.lineTo(dx * w, dy * h);
    }
    rctx.stroke();
  }

  for (let y = 0; y <= h; y += spacing) {
    rctx.beginPath();
    for (let i = 0; i <= nx; i++) {
      const x = (i / nx) * w;
      const u = x / w;
      const v = y / h;
      const [dx, dy] = distortPoint(u, v);
      rctx.lineTo(dx * w, dy * h);
    }
    rctx.stroke();
  }
}

// stage layout

const imagesElement = document.getElementById("images");
// const imageAspectRatio = 3 / 2; // width / height

// function waitFor(statement: () => any, ms = 100) {
//   return new Promise<void>((resolve) => {
//     const interval = setInterval(() => {
//       if (statement()) {
//         // call it as a function
//         clearInterval(interval);
//         resolve();
//       }
//     }, ms);
//   });
// }

function resizeStage() {
  if (!aspectRatio || !imagesElement) {
    return;
  }

  const controlsMinHeight = 260;
  const workingWidth = window.innerWidth;
  const workingHeight = window.innerHeight - controlsMinHeight;
  // const workingAspectRatio = workingWidth / workingHeight
  const bestImageWidthWhenStacked = Math.min(
    workingWidth,
    (workingHeight / 2) * aspectRatio
  );
  const bestImageWidthWhenFlat = Math.min(
    workingWidth / 2,
    workingHeight * aspectRatio
  );
  const stacked = bestImageWidthWhenStacked > bestImageWidthWhenFlat;
  if (stacked) {
    imagesElement.classList.add("col");
  } else {
    imagesElement.classList.remove("col");
  }
  imagesElement.style.width =
    (stacked
      ? Math.max(bestImageWidthWhenStacked, bestImageWidthWhenFlat)
      : Math.max(bestImageWidthWhenStacked, bestImageWidthWhenFlat) * 2) + "px";
}

window.addEventListener("resize", resizeStage);

// file handling

const fileInput =
  document.querySelector<HTMLInputElement>('input[type="file"]');

fileInput?.addEventListener("change", (event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  const file = target.files[0];
  originalFileName = file.name;
  const reader = new FileReader();

  reader.onload = () => {
    loadImg(reader.result as string);
  };

  reader.readAsDataURL(file);
});

// initial load
let originalImage: HTMLImageElement | null = null;
let originalFileName: string;
// export

function exportFullRes() {
  if (!originalImage) {
    console.error("No original image loaded.");
    return;
  }

  // Create a temp canvas + WebGL context at full res
  const tmpCanvas = document.createElement("canvas");
  tmpCanvas.width = originalImage.width;
  tmpCanvas.height = originalImage.height;
  const tmpGl = tmpCanvas.getContext("webgl")!;
  if (!tmpGl) throw new Error("WebGL not supported for export");

  // Build shaders/program again for tmpGl
  const tmpProgram = createProgram(tmpGl, vertexShaderSrc, fragmentShaderSrc);
  tmpGl.useProgram(tmpProgram);

  // Buffers
  const posLoc = tmpGl.getAttribLocation(tmpProgram, "a_position");
  const texLoc = tmpGl.getAttribLocation(tmpProgram, "a_texCoord");

  const posBuf = tmpGl.createBuffer();
  tmpGl.bindBuffer(tmpGl.ARRAY_BUFFER, posBuf);
  tmpGl.bufferData(
    tmpGl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    tmpGl.STATIC_DRAW
  );

  const texBuf = tmpGl.createBuffer();
  tmpGl.bindBuffer(tmpGl.ARRAY_BUFFER, texBuf);
  tmpGl.bufferData(
    tmpGl.ARRAY_BUFFER,
    new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]),
    tmpGl.STATIC_DRAW
  );

  // Upload original image as texture
  const tex = tmpGl.createTexture();
  tmpGl.bindTexture(tmpGl.TEXTURE_2D, tex);
  tmpGl.texImage2D(
    tmpGl.TEXTURE_2D,
    0,
    tmpGl.RGBA,
    tmpGl.RGBA,
    tmpGl.UNSIGNED_BYTE,
    originalImage
  );
  tmpGl.texParameteri(
    tmpGl.TEXTURE_2D,
    tmpGl.TEXTURE_WRAP_S,
    tmpGl.CLAMP_TO_EDGE
  );
  tmpGl.texParameteri(
    tmpGl.TEXTURE_2D,
    tmpGl.TEXTURE_WRAP_T,
    tmpGl.CLAMP_TO_EDGE
  );
  tmpGl.texParameteri(tmpGl.TEXTURE_2D, tmpGl.TEXTURE_MIN_FILTER, tmpGl.LINEAR);

  // Uniforms
  const uImageLoc = tmpGl.getUniformLocation(tmpProgram, "u_image");
  const uCenterLoc = tmpGl.getUniformLocation(tmpProgram, "u_center");
  const uK1Loc = tmpGl.getUniformLocation(tmpProgram, "u_k1");
  const uK2Loc = tmpGl.getUniformLocation(tmpProgram, "u_k2");
  const uK3Loc = tmpGl.getUniformLocation(tmpProgram, "u_k3");
  const uSLoc = tmpGl.getUniformLocation(tmpProgram, "u_S");

  tmpGl.viewport(0, 0, tmpCanvas.width, tmpCanvas.height);

  // Setup attributes
  tmpGl.bindBuffer(tmpGl.ARRAY_BUFFER, posBuf);
  tmpGl.enableVertexAttribArray(posLoc);
  tmpGl.vertexAttribPointer(posLoc, 2, tmpGl.FLOAT, false, 0, 0);

  tmpGl.bindBuffer(tmpGl.ARRAY_BUFFER, texBuf);
  tmpGl.enableVertexAttribArray(texLoc);
  tmpGl.vertexAttribPointer(texLoc, 2, tmpGl.FLOAT, false, 0, 0);

  // Set uniforms
  tmpGl.uniform2f(uCenterLoc, params.cx, params.cy);
  tmpGl.uniform1f(uK1Loc, params.k1);
  tmpGl.uniform1f(uK2Loc, params.k2);
  tmpGl.uniform1f(uK3Loc, params.k3);
  tmpGl.uniform1f(uSLoc, params.S);
  tmpGl.activeTexture(tmpGl.TEXTURE0);
  tmpGl.uniform1i(uImageLoc, 0);

  // Draw
  tmpGl.drawArrays(tmpGl.TRIANGLES, 0, 6);

  // Export as PNG
  const dataUrl = tmpCanvas.toDataURL("image/png");
  const link = document.createElement("a");
  const originalName = originalFileName || "image.png";
  const nameParts = originalName.split(".");
  const filename = nameParts.slice(0, -1).join(".") + "_corrected.png";
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

// Hook it up
const exportButton = document.getElementById("export");
exportButton?.addEventListener("click", exportFullRes);

// lens center

let opticalWidth = 100; //percent

const lensImg = document.getElementById("lensImg") as HTMLImageElement;
if (lensImg) {
  lensImg.onload = renderLensImg;
}

function renderLensImg() {
  if (!originalImage) {
    console.error("originalimage should be set");
    return;
  }
  const angle = Math.atan(originalImage.height / originalImage.width);
  const newWidth = Math.cos(angle) * opticalWidth;
  lensImg.style.width = newWidth + "%";
}

const opticalWidthSlider = document.getElementById(
  "opticalWidth"
) as HTMLInputElement;
const opticalWidthVal = document.getElementById("opticalWidthVal");

if (opticalWidthSlider && opticalWidthVal) {
  opticalWidthSlider.addEventListener("input", (e) => {
    opticalWidth = (e.target as HTMLInputElement).valueAsNumber;
    opticalWidthVal.innerText = opticalWidth.toFixed(0) + "%";
    renderLensImg();
  });
}

//initialLoad

function loadImg(src: string) {
  const image = new Image();
  image.onload = () => {
    // Save original full-res image
    originalImage = image;

    // Compute downscale factor (keep aspect ratio, max dimension = 2000)
    const maxDim = 2000;
    const scale = Math.min(1, maxDim / Math.max(image.width, image.height));
    const displayWidth = Math.round(image.width * scale);
    const displayHeight = Math.round(image.height * scale);

    aspectRatio = displayWidth / displayHeight;
    canvas.width = displayWidth;
    canvas.height = displayHeight;

    console.log("aspect ratio", aspectRatio);

    // Create an offscreen canvas to resize the image
    const offscreen = document.createElement("canvas");
    offscreen.width = displayWidth;
    offscreen.height = displayHeight;
    const ctx = offscreen.getContext("2d")!;
    ctx.drawImage(image, 0, 0, displayWidth, displayHeight);

    // Create WebGL texture from downsized image
    const texture = gl.createTexture();
    gl.viewport(0, 0, displayWidth, displayHeight);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      offscreen
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    resizeGrid();
    resizeReverseGrid();
    resizeStage();
    draw();
  };
  image.src = src;
  sourceImg.src = src;
  lensImg.src = src;
}

loadImg("/og/thumb.jpg");
