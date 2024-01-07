// inputs

const speedToMPS = {
  mph: 0.44704,
  kmph: 0.277778,
};

const maxSpeeds = {
  mph: 40,
  kmph: 64,
};

const speedUnitSelect = document.querySelector("#speed select");
const roadSpeedSlider = document.querySelector("#speed input");
let speedUnit = speedUnitSelect.value;
function handleNewSpeedUnit(unit) {
  speedUnit = unit;
  roadSpeedSlider.setAttribute("max", maxSpeeds[speedUnit]);
  const speed = Math.round(speedInMPS / speedToMPS[speedUnit]);
  roadSpeedSlider.value = speed;
  setSpeedInMPS(speed);
}
speedUnitSelect.addEventListener("change", (e) => {
  debugger;
  handleNewSpeedUnit(e.target.value);
});

const speedOutput = document.querySelector("#speed .val");
let nominalSpeed = roadSpeedSlider.value;
let speedInMPS = nominalSpeed * speedToMPS[speedUnit];

function setSpeedInMPS(speed) {
  nominalSpeed = speed;
  speedInMPS = speed * speedToMPS[speedUnit];
  speedOutput.innerHTML = Math.round(speed);
}
roadSpeedSlider.addEventListener("input", (e) => {
  setSpeedInMPS(e.target.value);
});

window.running = false; // will be true when running

const pauseButton = document.querySelector("#pausePlay");
function toggleRunning(e) {
  if (running) {
    window.running = false;
    e.target.innerHTML = "Resume";
    calibrateButton.classList.add("disabled");
  } else {
    window.running = true;
    e.target.innerHTML = "Pause";
    calibrateButton.classList.remove("disabled");
    simulate();
    window.resumeML();
  }
}
pauseButton.addEventListener("click", toggleRunning);

const directionSelect = document.querySelector("#direction select");
window.directionRight = directionSelect.value;
directionSelect.addEventListener("change", (e) => {
  window.directionRight = e.target.value == "right";
  if (window.directionRight) {
    document.body.classList.remove("flowLeft");
  } else {
    document.body.classList.add("flowLeft");
  }
});

const calibrateButton = document.querySelector("button#calibrate");
calibrateButton.addEventListener("click", (e) => {
  calibrate();
});

const powerSavedElement = document.querySelector("#powerSaving .val");
const forceSavedElement = document.querySelector("#forceSaving .val");

// calibration

let c;
const b = 0.0450364;
const thirtyFiveToMPS = 35 * speedToMPS["kmph"];

function sleep(ms) {
  return new Promise((res) => {
    setTimeout(res, ms);
  });
}

let initialUnit;
let initialSpeed;
let topForce;

async function calibrate() {
  initialUnit = speedUnit;
  initialSpeed = nominalSpeed;
  speedUnitSelect.value = "kmph";
  handleNewSpeedUnit("kmph");
  setSpeedInMPS(35);
  roadSpeedSlider.value = 35;
  if (!running) {
  }
  let maxFavg = -Infinity;
  let minFavg = Infinity;
  const waitingMs = 10000;
  let stopTime = new Date(new Date().getTime() + waitingMs);
  while (new Date() < stopTime) {
    if (forceAvg !== undefined) {
      maxFavg = Math.max(maxFavg, forceAvg);
      minFavg = Math.min(minFavg, forceAvg);
    }
    await sleep(1000 / fps);
  }
  topForce = maxFavg;
  c = (b * thirtyFiveToMPS * thirtyFiveToMPS) / (maxFavg - minFavg);
  console.log("found c to be", c, maxFavg, minFavg);
  speedUnitSelect.value = initialUnit;
  handleNewSpeedUnit(initialUnit);
  setSpeedInMPS(initialSpeed);
  roadSpeedSlider.value = initialSpeed;
}

// physics

const dxdt = 1;
const dxdt2 = dxdt * dxdt;

const gridHeight = 54;
const gridWidth = 96;

const u0 = 0.1;
const viscosity = 0.02;

const fps = (window.fps = 24);

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

var canvas = document.getElementById("physicsCanvas");
var context = canvas.getContext("2d");
context.canvas.width = gridWidth * pxPerSquare;
context.canvas.height = gridHeight * pxPerSquare;
var image = context.createImageData(canvas.width, canvas.height); // for direct pixel manipulation (faster than fillRect)
for (var i = 3; i < image.data.length; i += 4) image.data[i] = 255; // set all alpha values to opaque

var xdim = canvas.width / pxPerSquare; // grid dimensions for simulation
var ydim = canvas.height / pxPerSquare;

var four9ths = 4.0 / 9.0; // abbreviations
var one9th = 1.0 / 9.0;
var one36th = 1.0 / 36.0;

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

let needToRenderNewBarrier = false;

async function checkForNewBoundary() {
  if (window.newBoundaries) {
    const [highRes, simRes] = window.newBoundaries;
    needToRenderNewBarrier = true;
    for (let i = 0; i < highRes.length; i++) {
      barrierImage.data[i * 4 + 3] = highRes[i] > 0 ? 0 : 180;
    }
    for (var y = 1; y < ydim - 1; y++) {
      for (var x = 1; x < xdim - 1; x++) {
        var i = x + y * xdim; // array index for this lattice site
      }
    }
    barrier = simRes;
  }
  window.newBoundaries = undefined;
}

// Simulate function executes a bunch of steps and then schedules another call to itself:
function simulate() {
  const start = new Date();
  const deltaX = speedInMPS / fps;
  let dx = sceneWidth / gridWidth; // meters per cell
  // speed = deltaX/dt
  // dt = 1 / fps
  // deltaX = speed/fps
  // steps = deltaX / dx
  var stepsPerFrame = Math.round((deltaX / dx) * 4);
  // dx/dt = 1
  // dxForC = 1/fps
  checkForNewBoundary();
  setBoundaries();
  // Execute a bunch of time steps:
  for (var step = 0; step < stepsPerFrame; step++) {
    collide();
    stream();
  }
  paintCanvas();
  var stable = true;
  for (var x = 0; x < xdim; x++) {
    var index = x + (ydim / 2) * xdim; // look at middle row only
    if (rho[index] <= 0) stable = false;
  }
  if (!stable) {
    initFluid();
  }
  const duration = new Date().getTime() - start.getTime();
  if (running) {
    window.setTimeout(simulate, 1000 / fps - duration);
  }
}

// Set the fluid variables at the boundaries, according to the current slider value:
function setBoundaries() {
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

function computeNaturalForce() {
  let Fx = 0;
  let Fy = 0;
  for (var y = 1; y < ydim - 1; y++) {
    // Now handle bounce-back from barriers
    for (var x = 1; x < xdim - 1; x++) {
      if (barrier[x + y * xdim]) {
        var index = x + y * xdim;
        Fx +=
          nE[index] +
          nNE[index] +
          nSE[index] -
          nW[index] -
          nNW[index] -
          nSW[index];
        Fy +=
          nN[index] +
          nNE[index] +
          nNW[index] -
          nS[index] -
          nSE[index] -
          nSW[index];
      }
    }
  }
  return [Fx, Fy];
}

let chartFrames = 0;
let chartMaxSeconds = 10;
let chartUpdatesPerSecond = (window.chartUpdatesPerSecond = 4);

window.forceSavings = new Array(chartMaxSeconds * fps + 1);
window.powerSavings = new Array(chartMaxSeconds * fps + 1);
const MAWindow = fps;
window.powerMA = [];
// let powerWindowSum = 0;
// window.forceMA = new Array(chartMaxSeconds * fps + 1);
// let forceWindowSum = 0;

let forceSum = 0;
let forceAvg;
let naturalForces = [];
let numNaturalForces = 0;

function paintCanvas() {
  barrierContext.putImageData(barrierImage, 0, 0);
  computeCurl();
  const [Fx, Fy] = computeNaturalForce();
  forceSum += Fx;
  naturalForces.push(Fx);
  if (naturalForces.length > MAWindow) {
    forceSum -= naturalForces[naturalForces.length - MAWindow - 1];
    naturalForces.shift();
    forceAvg = forceSum / MAWindow;
  }
  if (c) {
    const forceSaved = c * (topForce - Fx);
    window.forceSavings.push(forceSaved);
    forceSavedElement.innerHTML = Math.round(forceSaved * 10) / 10;
    const powerSaved = forceSaved * speedInMPS;
    window.powerSavings.push(powerSaved);
    powerSavedElement.innerHTML = Math.round(powerSaved);
    window.forceSavings.shift();
    window.powerSavings.shift();
    // const oldestPowerInWindow =
    //   window.powerSavings[window.powerSavings.length - MAWindow - 1];
    // if (oldestPowerInWindow) {
    //   powerWindowSum -= oldestPowerInWindow;
    //   window.powerMA.push(powerWindowSum / MAWindow);
    //   window.powerMA.shift();
    // }
    // if (chartFrames > 0 && chartFrames % MAWindow == 0) {
    //   // debugger;
    //   let powerMAVal = 0;
    //   for (let i = 0; i < MAWindow; i++) {
    //     powerMAVal += window.powerSavings[window.powerSavings.length - i - 1];
    //   }
    //   powerMAVal /= MAWindow;
    //   window.powerMA.shift();
    //   window.powerMA.push(powerMAVal);
    // }

    if (chartFrames % (fps / chartUpdatesPerSecond) == 0) {
      if (window.powerSavings[window.powerSavings.length - MAWindow]) {
        let powerMAVal = 0;
        for (let i = 0; i < MAWindow; i++) {
          powerMAVal += window.powerSavings[window.powerSavings.length - i - 1];
        }
        powerMAVal /= MAWindow;
        if (
          window.powerMA.length ==
          chartMaxSeconds * chartUpdatesPerSecond + 1
        ) {
          window.powerMA.shift();
        }
        window.powerMA.push(powerMAVal);
      }
      window.updateCharts();
    }
    chartFrames++;
  }

  for (var y = 0; y < ydim; y++) {
    for (var x = 0; x < xdim; x++) {
      if (barrier[x + y * xdim]) {
        colorSquare(x, y, 0, 0, 0, 0);
      } else {
        const curlValue = curl[x + y * xdim];
        let r, g, b;
        if (curlValue < 0) {
          r = 255;
          g = 140;
          b = 120;
        } else {
          r = 120;
          g = 140;
          b = 255;
        }
        const relative = Math.max(0, Math.min(1, Math.abs(curlValue) * 5));
        const a = (0.02 + 0.98 * Math.pow(relative, 0.8)) * 255;
        colorSquare(x, y, r, g, b, a);
      }
    }
  }
  //if (pixelGraphics)
  context.putImageData(image, 0, 0); // blast image to the screen
}

function colorSquare(x, y, r, g, b, a) {
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

function computeCurl() {
  for (var y = 1; y < ydim - 1; y++) {
    for (var x = 1; x < xdim - 1; x++) {
      curl[x + y * xdim] =
        uy[x + 1 + y * xdim] -
        uy[x - 1 + y * xdim] -
        ux[x + (y + 1) * xdim] +
        ux[x + (y - 1) * xdim];
    }
  }
}

function initFluid() {
  for (var y = 0; y < ydim; y++) {
    for (var x = 0; x < xdim; x++) {
      setEquil(x, y, u0, 0, 1);
      curl[x + y * xdim] = 0.0;
    }
  }
  paintCanvas();
}

initFluid(); // initialize to steady rightward flow
