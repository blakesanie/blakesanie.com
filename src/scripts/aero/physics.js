const dxdt = 1;
const dxdt2 = dxdt * dxdt;

const gridHeight = 54;
const gridWidth = 96;

const fps = 24;
let sceneWidth = 2.5; // meters
let dx = sceneWidth / gridWidth; // meters per cell

var pxPerSquare = 10; //Number(sizeSelect.options[sizeSelect.selectedIndex].value);

const barrierCanvas = document.getElementById("barrierCanvas");
const barrierContext = barrierCanvas.getContext("2d");
barrierContext.canvas.width = 513;
barrierContext.canvas.height = 289;
var barrierImage = barrierContext.createImageData(
  barrierCanvas.width,
  barrierCanvas.height
);

var mobile = navigator.userAgent.match(
  /iPhone|iPad|iPod|Android|BlackBerry|Opera Mini|IEMobile/i
);
var canvas = document.getElementById("physicsCanvas");
var context = canvas.getContext("2d");
context.canvas.width = gridWidth * pxPerSquare;
context.canvas.height = gridHeight * pxPerSquare;
var image = context.createImageData(canvas.width, canvas.height); // for direct pixel manipulation (faster than fillRect)
for (var i = 3; i < image.data.length; i += 4) image.data[i] = 255; // set all alpha values to opaque
//   var sizeSelect = document.getElementById("sizeSelect");
//   sizeSelect.selectedIndex = 5;
//   if (mobile) sizeSelect.selectedIndex = 1; // smaller works better on mobile platforms

// width of plotted grid site in pixels
var xdim = canvas.width / pxPerSquare; // grid dimensions for simulation
var ydim = canvas.height / pxPerSquare;
var resetFluidButton = document.getElementById("resetFluidButton");
resetFluidButton?.addEventListener("click", initFluid);
var stepsSlider = document.getElementById("stepsSlider");
var startButton = document.getElementById("startButton");
startButton?.addEventListener("click", startStop);
var speedSlider = document.getElementById("speedSlider");
speedSlider?.addEventListener("change", adjustSpeed);
var speedValue = document.getElementById("speedValue");
var viscSlider = document.getElementById("viscSlider");
viscSlider?.addEventListener("click", adjustViscosity);
var viscValue = document.getElementById("viscValue");
var mouseSelect = document.getElementById("mouseSelect");
var barrierSelect = document.getElementById("barrierSelect");
//   for (
//     var barrierIndex = 0;
//     barrierIndex < barrierList.length;
//     barrierIndex++
//   ) {
//     var shape = document.createElement("option");
//     shape.text = barrierList[barrierIndex].name;
//     barrierSelect.add(shape, null);
//   }
var plotSelect = document.getElementById("plotSelect");
//   var contrastSlider = document.getElementById("contrastSlider");
//var pixelCheck = document.getElementById('pixelCheck');
var tracerCheck = document.getElementById("tracerCheck");
var flowlineCheck = document.getElementById("flowlineCheck");
var forceCheck = document.getElementById("forceCheck");
var sensorCheck = document.getElementById("sensorCheck");
var rafCheck = document.getElementById("rafCheck");
var speedReadout = document.getElementById("speedReadout");
var running = false; // will be true when running
var stepCount = 0;
var startTime = 0;
var four9ths = 4.0 / 9.0; // abbreviations
var one9th = 1.0 / 9.0;
var one36th = 1.0 / 36.0;
var barrierCount = 0;
var barrierxSum = 0;
var barrierySum = 0;
var barrierFx = 0.0; // total force on all barrier sites
var barrierFy = 0.0;
var time = 0; // time (in simulation step units) since data collection started
var showingPeriod = false;
var lastBarrierFy = 1; // for determining when F_y oscillation begins
var lastFyOscTime = 0; // for calculating F_y oscillation period

// Create the arrays of fluid particle densities, etc. (using 1D arrays for speed):
// To index into these arrays, use x + y*xdim, traversing rows first and then columns.
var n0 = new Array(xdim * ydim); // microscopic densities along each lattice direction
var nN = new Array(xdim * ydim);
var nS = new Array(xdim * ydim);
var nE = new Array(xdim * ydim);
var nW = new Array(xdim * ydim);
var nNE = new Array(xdim * ydim);
var nSE = new Array(xdim * ydim);
var nNW = new Array(xdim * ydim);
var nSW = new Array(xdim * ydim);
var rho = new Array(xdim * ydim); // macroscopic density
var ux = new Array(xdim * ydim); // macroscopic velocity
var uy = new Array(xdim * ydim);
var curl = new Array(xdim * ydim);
var barrier = new Array(xdim * ydim); // boolean array of barrier locations

// Initialize to a steady rightward flow with no barriers:
for (var y = 0; y < ydim; y++) {
  for (var x = 0; x < xdim; x++) {
    barrier[x + y * xdim] = false;
  }
}

// Create a simple linear "wall" barrier (intentionally a little offset from center):
var barrierSize = 8;
if (mobile) barrierSize = 4;
for (var y = ydim / 2 - barrierSize; y <= ydim / 2 + barrierSize; y++) {
  var x = Math.round(ydim / 3);
  barrier[x + y * xdim] = true;
}

// Set up the array of colors for plotting (mimicks matplotlib "jet" colormap):
// (Kludge: Index nColors+1 labels the color used for drawing barriers.)
var nColors = 400; // there are actually nColors+2 colors
var hexColorList = new Array(nColors + 2);
var redList = new Array(nColors + 2);
var greenList = new Array(nColors + 2);
var blueList = new Array(nColors + 2);
for (var c = 0; c <= nColors; c++) {
  var r, g, b;
  if (c < nColors / 8) {
    r = 0;
    g = 0;
    b = Math.round((255 * (c + nColors / 8)) / (nColors / 4));
  } else if (c < (3 * nColors) / 8) {
    r = 0;
    g = Math.round((255 * (c - nColors / 8)) / (nColors / 4));
    b = 255;
  } else if (c < (5 * nColors) / 8) {
    r = Math.round((255 * (c - (3 * nColors) / 8)) / (nColors / 4));
    g = 255;
    b = 255 - r;
  } else if (c < (7 * nColors) / 8) {
    r = 255;
    g = Math.round((255 * ((7 * nColors) / 8 - c)) / (nColors / 4));
    b = 0;
  } else {
    r = Math.round((255 * ((9 * nColors) / 8 - c)) / (nColors / 4));
    g = 0;
    b = 0;
  }
  redList[c] = r;
  greenList[c] = g;
  blueList[c] = b;
  hexColorList[c] = rgbToHex(r, g, b);
}
redList[nColors + 1] = 0;
greenList[nColors + 1] = 0;
blueList[nColors + 1] = 0; // barriers are black
hexColorList[nColors + 1] = rgbToHex(0, 0, 0);

// Functions to convert rgb to hex color string (from stackoverflow):
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

initFluid(); // initialize to steady rightward flow

// Mysterious gymnastics that are apparently useful for better cross-browser animation timing:
window.requestAnimFrame = (function (callback) {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1); // second parameter is time in ms
    }
  );
})();

let needToRenderNewBarrier = false;

async function checkForNewBoundary() {
  // const addIndices = [];
  // const removeIndices = [];
  // debugger;
  if (window.newBoundaries) {
    needToRenderNewBarrier = true;
    for (let i = 0; i < window.newBoundaries.length; i++) {
      barrierImage.data[i * 4 + 3] = window.newBoundaries[i] > 0 ? 0 : 180;
    }
  }
  // debugger;
  window.newBoundaries = undefined;
}

// Simulate function executes a bunch of steps and then schedules another call to itself:
function simulate() {
  const start = new Date();
  const speed = 14; // m/s
  const deltaX = speed / fps;
  let dx = sceneWidth / gridWidth; // meters per cell
  // speed = deltaX/dt
  // dt = 1 / fps
  // deltaX = speed/fps
  // steps = deltaX / dx
  var stepsPerFrame = Math.round(deltaX / dx);
  setBoundaries();
  checkForNewBoundary();
  // Execute a bunch of time steps:
  for (var step = 0; step < stepsPerFrame; step++) {
    collide();
    stream();
    time++;
    if (showingPeriod && barrierFy > 0 && lastBarrierFy <= 0) {
      var thisFyOscTime = time - barrierFy / (barrierFy - lastBarrierFy); // interpolate when Fy changed sign
      if (lastFyOscTime > 0) {
        var period = thisFyOscTime - lastFyOscTime;
      }
      lastFyOscTime = thisFyOscTime;
    }
    lastBarrierFy = barrierFy;
  }
  paintCanvas();
  if (running) {
    stepCount += stepsPerFrame;
    var elapsedTime = (new Date().getTime() - startTime) / 1000; // time in seconds
    speedReadout.innerHTML = Number(stepCount / elapsedTime).toFixed(0);
  }
  var stable = true;
  for (var x = 0; x < xdim; x++) {
    var index = x + (ydim / 2) * xdim; // look at middle row only
    if (rho[index] <= 0) stable = false;
  }
  if (!stable) {
    window.alert(
      "The simulation has become unstable due to excessive fluid speeds."
    );
    startStop();
    initFluid();
  }
  const duration = new Date().getTime() - start.getTime();
  if (running) {
    window.setTimeout(simulate, 1000 / fps - duration);
  }
}

// Set the fluid variables at the boundaries, according to the current slider value:
function setBoundaries() {
  var u0 = Number(speedSlider.value);
  for (var x = 0; x < xdim; x++) {
    setEquil(x, 0, u0, 0, 1);
    setEquil(x, ydim - 1, u0, 0, 1);
  }
  for (var y = 1; y < ydim - 1; y++) {
    setEquil(0, y, u0, 0, 1);
    setEquil(xdim - 1, y, u0, 0, 1);
  }
}

// Collide particles within each cell (here's the physics!):
function collide() {
  var viscosity = Number(viscSlider.value); // kinematic viscosity coefficient in natural units
  var omega = 1 / (3 * viscosity + 0.5); // reciprocal of relaxation time
  for (var y = 1; y < ydim - 1; y++) {
    for (var x = 1; x < xdim - 1; x++) {
      var i = x + y * xdim; // array index for this lattice site
      var thisrho =
        n0[i] +
        nN[i] +
        nS[i] +
        nE[i] +
        nW[i] +
        nNW[i] +
        nNE[i] +
        nSW[i] +
        nSE[i];
      rho[i] = thisrho;
      var thisux =
        (nE[i] + nNE[i] + nSE[i] - nW[i] - nNW[i] - nSW[i]) / thisrho;
      ux[i] = thisux;
      var thisuy =
        (nN[i] + nNE[i] + nNW[i] - nS[i] - nSE[i] - nSW[i]) / thisrho;
      uy[i] = thisuy;
      var one9thrho = one9th * thisrho; // pre-compute a bunch of stuff for optimization
      var one36thrho = one36th * thisrho;
      var ux3 = 3 * thisux;
      var uy3 = 3 * thisuy;
      var ux2 = thisux * thisux;
      var uy2 = thisuy * thisuy;
      var uxuy2 = 2 * thisux * thisuy;
      var u2 = ux2 + uy2;
      var u215 = 1.5 * u2;
      n0[i] += omega * (four9ths * thisrho * (1 - u215 / dxdt2) - n0[i]);
      nE[i] +=
        omega *
        (one9thrho * (1 + ux3 / dxdt + (4.5 * ux2) / dxdt2 - u215 / dxdt2) -
          nE[i]);
      nW[i] +=
        omega *
        (one9thrho * (1 - ux3 / dxdt + (4.5 * ux2) / dxdt2 - u215 / dxdt2) -
          nW[i]);
      nN[i] +=
        omega *
        (one9thrho * (1 + uy3 / dxdt + (4.5 * uy2) / dxdt2 - u215 / dxdt2) -
          nN[i]);
      nS[i] +=
        omega *
        (one9thrho * (1 - uy3 / dxdt + (4.5 * uy2) / dxdt2 - u215 / dxdt2) -
          nS[i]);
      nNE[i] +=
        omega *
        (one36thrho *
          (1 +
            (ux3 + uy3) / dxdt +
            (4.5 * (u2 + uxuy2)) / dxdt2 -
            u215 / dxdt2) -
          nNE[i]);
      nSE[i] +=
        omega *
        (one36thrho *
          (1 +
            (ux3 - uy3) / dxdt +
            (4.5 * (u2 - uxuy2)) / dxdt2 -
            u215 / dxdt2) -
          nSE[i]);
      nNW[i] +=
        omega *
        (one36thrho *
          (1 -
            (ux3 - uy3) / dxdt +
            (4.5 * (u2 - uxuy2)) / dxdt2 -
            u215 / dxdt2) -
          nNW[i]);
      nSW[i] +=
        omega *
        (one36thrho *
          (1 -
            (ux3 + uy3) / dxdt +
            (4.5 * (u2 + uxuy2)) / dxdt2 -
            u215 / dxdt2) -
          nSW[i]);
    }
  }
  for (var y = 1; y < ydim - 2; y++) {
    nW[xdim - 1 + y * xdim] = nW[xdim - 2 + y * xdim]; // at right end, copy left-flowing densities from next row to the left
    nNW[xdim - 1 + y * xdim] = nNW[xdim - 2 + y * xdim];
    nSW[xdim - 1 + y * xdim] = nSW[xdim - 2 + y * xdim];
  }
}

// Move particles along their directions of motion:
function stream() {
  barrierCount = 0;
  barrierxSum = 0;
  barrierySum = 0;
  barrierFx = 0.0;
  barrierFy = 0.0;
  for (var y = ydim - 2; y > 0; y--) {
    // first start in NW corner...
    for (var x = 1; x < xdim - 1; x++) {
      nN[x + y * xdim] = nN[x + (y - 1) * xdim]; // move the north-moving particles
      nNW[x + y * xdim] = nNW[x + 1 + (y - 1) * xdim]; // and the northwest-moving particles
    }
  }
  for (var y = ydim - 2; y > 0; y--) {
    // now start in NE corner...
    for (var x = xdim - 2; x > 0; x--) {
      nE[x + y * xdim] = nE[x - 1 + y * xdim]; // move the east-moving particles
      nNE[x + y * xdim] = nNE[x - 1 + (y - 1) * xdim]; // and the northeast-moving particles
    }
  }
  for (var y = 1; y < ydim - 1; y++) {
    // now start in SE corner...
    for (var x = xdim - 2; x > 0; x--) {
      nS[x + y * xdim] = nS[x + (y + 1) * xdim]; // move the south-moving particles
      nSE[x + y * xdim] = nSE[x - 1 + (y + 1) * xdim]; // and the southeast-moving particles
    }
  }
  for (var y = 1; y < ydim - 1; y++) {
    // now start in the SW corner...
    for (var x = 1; x < xdim - 1; x++) {
      nW[x + y * xdim] = nW[x + 1 + y * xdim]; // move the west-moving particles
      nSW[x + y * xdim] = nSW[x + 1 + (y + 1) * xdim]; // and the southwest-moving particles
    }
  }
  for (var y = 1; y < ydim - 1; y++) {
    // Now handle bounce-back from barriers
    for (var x = 1; x < xdim - 1; x++) {
      if (barrier[x + y * xdim]) {
        var index = x + y * xdim;
        nE[x + 1 + y * xdim] = nW[index];
        nW[x - 1 + y * xdim] = nE[index];
        nN[x + (y + 1) * xdim] = nS[index];
        nS[x + (y - 1) * xdim] = nN[index];
        nNE[x + 1 + (y + 1) * xdim] = nSW[index];
        nNW[x - 1 + (y + 1) * xdim] = nSE[index];
        nSE[x + 1 + (y - 1) * xdim] = nNW[index];
        nSW[x - 1 + (y - 1) * xdim] = nNE[index];
        // Keep track of stuff needed to plot force vector:
        barrierCount++;
        barrierxSum += x;
        barrierySum += y;
        barrierFx +=
          nE[index] +
          nNE[index] +
          nSE[index] -
          nW[index] -
          nNW[index] -
          nSW[index];
        barrierFy +=
          nN[index] +
          nNE[index] +
          nNW[index] -
          nS[index] -
          nSE[index] -
          nSW[index];
      }
    }
  }
}

// Set all densities in a cell to their equilibrium values for a given velocity and density:
// (If density is omitted, it's left unchanged.)
function setEquil(x, y, newux, newuy, newrho) {
  var i = x + y * xdim;
  if (typeof newrho == "undefined") {
    newrho = rho[i];
  }
  var ux3 = 3 * newux;
  var uy3 = 3 * newuy;
  var ux2 = newux * newux;
  var uy2 = newuy * newuy;
  var uxuy2 = 2 * newux * newuy;
  var u2 = ux2 + uy2;
  var u215 = 1.5 * u2;
  n0[i] = four9ths * newrho * (1 - u215);
  nE[i] =
    one9th * newrho * (1 + ux3 / dxdt + (4.5 * ux2) / dxdt2 - u215 / dxdt2);
  nW[i] =
    one9th * newrho * (1 - ux3 / dxdt + (4.5 * ux2) / dxdt2 - u215 / dxdt2);
  nN[i] =
    one9th * newrho * (1 + uy3 / dxdt + (4.5 * uy2) / dxdt2 - u215 / dxdt2);
  nS[i] =
    one9th * newrho * (1 - uy3 / dxdt + (4.5 * uy2) / dxdt2 - u215 / dxdt2);
  nNE[i] =
    one36th *
    newrho *
    (1 + (ux3 + uy3) / dxdt + (4.5 * (u2 + uxuy2)) / dxdt2 - u215 / dxdt2);
  nSE[i] =
    one36th *
    newrho *
    (1 + (ux3 - uy3) / dxdt + (4.5 * (u2 - uxuy2)) / dxdt2 - u215 / dxdt2);
  nNW[i] =
    one36th *
    newrho *
    (1 - (ux3 - uy3) / dxdt + (4.5 * (u2 - uxuy2)) / dxdt2 - u215 / dxdt2);
  nSW[i] =
    one36th *
    newrho *
    (1 - (ux3 + uy3) / dxdt + (4.5 * (u2 + uxuy2)) / dxdt2 - u215 / dxdt2);
  rho[i] = newrho;
  ux[i] = newux;
  uy[i] = newuy;
}

// Paint the canvas:
function paintCanvas() {
  var cIndex = 0;
  var contrast = Math.pow(1.2, 0 /*Number(contrastSlider.value)*/);
  var plotType = 4;
  // for (const index of addIndices) {
  //   const i = index * 4;
  //   barrierImage.data[i] = 0;
  //   barrierImage.data[i + 1] = 0;
  //   barrierImage.data[i + 2] = 0;
  //   barrierImage.data[i + 3] = 0.5;
  // }
  // for (const index of removeIndices) {
  //   const i = index * 4;
  //   barrierImage.data[i] = 0;
  //   barrierImage.data[i + 1] = 0;
  //   barrierImage.data[i + 2] = 0;
  //   barrierImage.data[i + 3] = 0;
  // }
  barrierContext.putImageData(barrierImage, 0, 0);
  // debugger;
  //var pixelGraphics = pixelCheck.checked;
  if (plotType == 4) computeCurl();
  for (var y = 0; y < ydim; y++) {
    for (var x = 0; x < xdim; x++) {
      if (barrier[x + y * xdim]) {
        colorSquare(x, y, 0, 0, 0, 255);
        //   cIndex = nColors + 1; // kludge for barrier color which isn't really part of color map
      } else {
        const myColor = Math.min(
          255,
          Math.max(0, 256 / 2 + curl[x + y * xdim] * 500)
        );
        const a = Math.pow(Math.abs(myColor - 256 / 2) / (256 / 2), 0.7) * 255;
        colorSquare(x, y, myColor, myColor, myColor, a);
        //   if (plotType == 0) {
        //     cIndex = Math.round(
        //       nColors * ((rho[x + y * xdim] - 1) * 6 * contrast + 0.5)
        //     );
        //   } else if (plotType == 1) {
        //     cIndex = Math.round(
        //       nColors * (ux[x + y * xdim] * 2 * contrast + 0.5)
        //     );
        //   } else if (plotType == 2) {
        //     cIndex = Math.round(
        //       nColors * (uy[x + y * xdim] * 2 * contrast + 0.5)
        //     );
        //   } else if (plotType == 3) {
        //     var speed = Math.sqrt(
        //       ux[x + y * xdim] * ux[x + y * xdim] +
        //         uy[x + y * xdim] * uy[x + y * xdim]
        //     );
        //     cIndex = Math.round(nColors * (speed * 4 * contrast));
        //   } else {
        //     cIndex = Math.round(
        //       nColors * (curl[x + y * xdim] * 5 * contrast + 0.5)
        //     );
        //   }
        //   if (cIndex < 0) cIndex = 0;
        //   if (cIndex > nColors) cIndex = nColors;
      }
      //if (pixelGraphics) {
      //colorSquare(x, y, cIndex);
      // colorSquare(x, y, redList[cIndex], greenList[cIndex], blueList[cIndex]);
      //} else {
      //	context.fillStyle = hexColorList[cIndex];
      //	context.fillRect(x*pxPerSquare, (ydim-y-1)*pxPerSquare, pxPerSquare, pxPerSquare);
      //}
    }
  }
  //if (pixelGraphics)
  context.putImageData(image, 0, 0); // blast image to the screen
  // Draw tracers, force vector, and/or sensor if appropriate:
  if (tracerCheck.checked) drawTracers();
  if (flowlineCheck.checked) drawFlowlines();
  if (forceCheck.checked)
    drawForceArrow(
      barrierxSum / barrierCount,
      barrierySum / barrierCount,
      barrierFx,
      barrierFy
    );
  if (sensorCheck.checked) drawSensor();
}

// Color a grid square in the image data array, one pixel at a time (rgb each in range 0 to 255):
function colorSquare(x, y, r, g, b, a) {
  //function colorSquare(x, y, cIndex) {		// for some strange reason, this version is quite a bit slower on Chrome
  //var r = redList[cIndex];
  //var g = greenList[cIndex];
  //var b = blueList[cIndex];
  var flippedy = ydim - y - 1; // put y=0 at the bottom
  for (
    var py = flippedy * pxPerSquare;
    py < (flippedy + 1) * pxPerSquare;
    py++
  ) {
    for (var px = x * pxPerSquare; px < (x + 1) * pxPerSquare; px++) {
      var index = (px + py * image.width) * 4;
      image.data[index + 0] = r;
      image.data[index + 1] = g;
      image.data[index + 2] = b;
      image.data[index + 3] = a;
    }
  }
}

// Compute the curl (actually times 2) of the macroscopic velocity field, for plotting:
function computeCurl() {
  for (var y = 1; y < ydim - 1; y++) {
    // interior sites only; leave edges set to zero
    for (var x = 1; x < xdim - 1; x++) {
      curl[x + y * xdim] =
        uy[x + 1 + y * xdim] -
        uy[x - 1 + y * xdim] -
        ux[x + (y + 1) * xdim] +
        ux[x + (y - 1) * xdim];
    }
  }
}

// Draw an arrow to represent the total force on the barrier(s):
function drawForceArrow(x, y, Fx, Fy) {
  context.fillStyle = "rgba(100,100,100,0.7)";
  context.translate(
    (x + 0.5) * pxPerSquare,
    canvas.height - (y + 0.5) * pxPerSquare
  );
  var magF = Math.sqrt(Fx * Fx + Fy * Fy);
  context.scale(4 * magF, 4 * magF);
  context.rotate(Math.atan2(-Fy, Fx));
  context.beginPath();
  context.moveTo(0, 3);
  context.lineTo(100, 3);
  context.lineTo(100, 12);
  context.lineTo(130, 0);
  context.lineTo(100, -12);
  context.lineTo(100, -3);
  context.lineTo(0, -3);
  context.lineTo(0, 3);
  context.fill();
  context.setTransform(1, 0, 0, 1, 0, 0);
}

// Function to initialize or re-initialize the fluid, based on speed slider setting:
function initFluid() {
  // Amazingly, if I nest the y loop inside the x loop, Firefox slows down by a factor of 20
  var u0 = Number(speedSlider.value);
  for (var y = 0; y < ydim; y++) {
    for (var x = 0; x < xdim; x++) {
      setEquil(x, y, u0, 0, 1);
      curl[x + y * xdim] = 0.0;
    }
  }
  paintCanvas();
}

// Function to start or pause the simulation:
function startStop() {
  running = !running;
  if (running) {
    startButton.value = "Pause";
    resetTimer();
    simulate();
  } else {
    startButton.value = " Run ";
  }
}

// Reset the timer that handles performance evaluation:
function resetTimer() {
  stepCount = 0;
  startTime = new Date().getTime();
}

// Show value of flow speed setting:
function adjustSpeed() {
  speedValue.innerHTML = Number(speedSlider.value).toFixed(3);
}

// Show value of viscosity:
function adjustViscosity() {
  viscValue.innerHTML = Number(viscSlider.value).toFixed(3);
}
