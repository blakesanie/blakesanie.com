// inputs

const speedToMPS = {
  mph: 0.44704,
  kmph: 0.277778,
};

const maxSpeeds = {
  mph: 40,
  kmph: 64,
};

const speedUnitSelect = document.querySelector("#unitSelect");
const roadSpeedSlider = document.querySelector("#speedSlider");
let speedUnit = speedUnitSelect.value;
function handleNewSpeedUnit(unit) {
  speedUnit = unit;
  roadSpeedSlider.setAttribute("max", maxSpeeds[speedUnit]);
  const speed = Math.round(speedInMPS / speedToMPS[speedUnit]);
  roadSpeedSlider.value = speed;
  setSpeedInMPS(speed);
}
speedUnitSelect.addEventListener("change", (e) => {
  handleNewSpeedUnit(e.target.value);
});

const speedOutput = document.querySelector("#speedOutput");
let nominalSpeed;
let speedInMPS;
let u0;
// debugger;

function setSpeedInMPS(speed) {
  nominalSpeed = speed;
  speedInMPS = speed * speedToMPS[speedUnit];
  u0 = 0.1 * speedInMPS * 0.056;
  speedOutput.innerHTML = Math.round(speed);
}
setSpeedInMPS(roadSpeedSlider.value);
roadSpeedSlider.addEventListener("input", (e) => {
  setSpeedInMPS(e.target.value);
});

window.running = false; // will be true when running

const pauseButton = document.querySelector("#pausePlay");
function toggleRunning(e) {
  if (window.running) {
    window.running = false;
    e.target.innerHTML = "Resume";
    calibrateButton.classList.add("disabled");
  } else {
    pauseButton.classList.remove("flashing");
    e.target.innerHTML = "Pause";
    calibrateButton.classList.remove("disabled");
    setTimeout(() => {
      window.running = true;
      simulate();
      window.resumeML();
    }, 0);
  }
}
pauseButton.addEventListener("click", toggleRunning);

const directionSelect = document.querySelector("#direction");
window.directionRight = directionSelect.value;
directionSelect.addEventListener("change", (e) => {
  window.directionRight = e.target.value == "right";
  if (window.directionRight) {
    document.body.classList.remove("flowLeft");
  } else {
    document.body.classList.add("flowLeft");
  }
});

const calibrateButton = document.querySelector("#calibrateButton");
calibrateButton.addEventListener("click", (e) => {
  calibrate();
});

const powerSavedElement = document.querySelector("#powerSaving .val");
const forceSavedElement = document.querySelector("#forceSaving .val");

let expandedControlI = 0;
const moreControlsList = document.querySelectorAll(
  "#controlsHolder .moreControls"
);
const controlButtons = document.querySelectorAll("#controlsBar > button");
controlButtons.forEach((element, i) => {
  element.addEventListener("click", () => {
    if (i < moreControlsList.length) {
      if (expandedControlI == i) {
        moreControlsList[i].classList.remove("render");
        element.classList.remove("selectedButton");
        expandedControlI = undefined;
      } else {
        if (expandedControlI !== undefined) {
          moreControlsList[expandedControlI].classList.remove("render");
          controlButtons[expandedControlI].classList.remove("selectedButton");
        }
        moreControlsList[i].classList.add("render");
        element.classList.add("selectedButton");
        expandedControlI = i;
      }
    }
  });
});

const visSelect = document.querySelector("#visSelect");
let plotType = visSelect.value;
visSelect.addEventListener("change", (e) => {
  plotType = Number(e.target.value);
  paintCanvas();
});

// calibration

let c;
const b = 0.0450364;
const thirtyFiveToMPS = 35 * speedToMPS["kmph"];

window.sleep = function (ms) {
  return new Promise((res) => {
    setTimeout(res, ms);
  });
};

let initialUnit;
let initialSpeed;

let baselineLow;
let baselineHigh;

async function calibrate() {
  initialUnit = speedUnit;
  initialSpeed = nominalSpeed;
  speedUnitSelect.value = "kmph";
  handleNewSpeedUnit("kmph");
  setSpeedInMPS(35);
  roadSpeedSlider.value = 35;
  const windowSize = fps; // one second
  let windowSum = 0;
  const wind = [];
  const waitingMs = 10000;
  let absorbedMin = Infinity;
  let absorbedMax = -Infinity;
  let stopTime = new Date(new Date().getTime() + waitingMs);
  while (new Date() < stopTime) {
    if (wind.length == windowSize) {
      windowSum -= wind.shift();
    }
    wind.push(lastAbsorbedX / speedInMPS);
    windowSum += lastAbsorbedX / speedInMPS;
    if (wind.length == windowSize) {
      const avg = windowSum / windowSize;
      absorbedMin = Math.min(absorbedMin, avg);
      absorbedMax = Math.max(absorbedMax, avg);
    }
    await window.sleep(1000 / fps);
  }
  baselineLow = absorbedMin;
  baselineHigh = absorbedMax;
  console.log("set baselines", baselineLow, baselineHigh);
  speedUnitSelect.value = initialUnit;
  handleNewSpeedUnit(initialUnit);
  setSpeedInMPS(initialSpeed);
  roadSpeedSlider.value = initialSpeed;
}

// physics

const ydim = 1080 / 20 + 2;
const xdim = 1920 / 20 + 2;
window.xdim = xdim;
window.ydim = ydim;
const viscosity = 0.02;

const fps = (window.fps = 24);

let sceneWidth = 2.5; // meters
let dx = sceneWidth / xdim; // meters per cell

var pxPerSquare = 10; //Number(sizeSelect.options[sizeSelect.selectedIndex].value);

// const barrierCanvas = document.getElementById("barrierCanvas");
// const barrierContext = barrierCanvas.getContext("2d");
// barrierContext.canvas.width = 513;
// barrierContext.canvas.height = 289;
// var barrierImage = barrierContext.createImageData(
//   barrierCanvas.width,
//   barrierCanvas.height
// );

var canvas = document.getElementById("physicsCanvas");
var context = canvas.getContext("2d");
context.canvas.width = (xdim - 2) * pxPerSquare;
context.canvas.height = (ydim - 2) * pxPerSquare;
var image = context.createImageData(canvas.width, canvas.height); // for direct pixel manipulation (faster than fillRect)

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

let needToRenderNewBarrier = false;

async function checkForNewBoundary() {
  if (window.newBoundaries) {
    const [highRes, simRes] = window.newBoundaries;
    // needToRenderNewBarrier = true;
    // for (let i = 0; i < highRes.length; i++) {
    //   barrierImage.data[i * 4 + 3] = highRes[i] > 0 ? 0 : 180;
    // }
    // for (var y = 1; y < ydim - 1; y++) {
    //   for (var x = 1; x < xdim - 1; x++) {
    //     var i = x + y * xdim; // array index for this lattice site
    //   }
    // }
    for (let x = 1; x < xdim - 1; x++) {
      for (let y = 1; y < ydim - 1; y++) {
        const y2 = y - 1;
        const x2 = x - 1;
        const i2 = x2 + y2 * (xdim - 2);
        const i = x + y * xdim;
        if (barrier[i] && !simRes[i2]) {
          // was barrier, now isnt
          setEquil(x, y, u0, 0, 1);
        } else if (!barrier[i] && simRes[i2]) {
          setEquil(x, y, u0, 0, 0);
        }
        barrier[i] = simRes[i2];
      }
    }
    // barrier = simRes;
  }
  window.newBoundaries = undefined;
}

let scheduledStart;
let absorbedX;
let absorbedY;
let lastAbsorbedX;
let lastAbsorbedY;

let chartFrames = 0;
let chartMaxSeconds = 10;
const chartUpdatesPerSecond = 4;
window.framesPerChartUpdate = fps / chartUpdatesPerSecond;

window.forceSavings = new Array(chartMaxSeconds * fps + 1);
window.powerSavings = new Array(chartMaxSeconds * fps + 1);
window.powerMA = new Array(chartMaxSeconds * chartUpdatesPerSecond + 1);
const MAWindow = fps;
let powerWindowSum = 0;
// let powerSavingsSum = 0
// let powerWindowSum = 0

// Simulate function executes a bunch of steps and then schedules another call to itself:

const boundaryResetEvery = 20 * 2;

function simulate() {
  const start = new Date().getTime();
  checkForNewBoundary();
  absorbedX = 0;
  absorbedY = 0;
  for (var step = 0; step < 40 * 2; step++) {
    if (step % boundaryResetEvery == 0) {
      setBoundaries();
    }
    stream();
    collide();
  }
  lastAbsorbedX = absorbedX;
  lastAbsorbedY = absorbedY;
  if (baselineLow) {
    const onSpectrum =
      (baselineHigh - lastAbsorbedX / speedInMPS) /
      (baselineHigh - baselineLow);
    const aeroEndpointWattsSaved =
      0.0450364 * speedInMPS * speedInMPS * speedInMPS;
    const wattsSaved = onSpectrum * aeroEndpointWattsSaved;
    const forceSaved = wattsSaved / speedInMPS;

    const firstInWindow =
      window.powerSavings[window.powerSavings.length - MAWindow];
    powerWindowSum -=
      !firstInWindow || isNaN(firstInWindow) ? 0 : firstInWindow;
    powerWindowSum += wattsSaved;

    window.forceSavings.shift();
    window.forceSavings.push(forceSaved);
    window.powerSavings.shift();
    window.powerSavings.push(wattsSaved);

    powerSavedElement.innerHTML = Math.round(powerWindowSum / MAWindow);
    forceSavedElement.innerHTML =
      Math.round((powerWindowSum / MAWindow / speedInMPS) * 10) / 10;

    if (chartFrames % window.framesPerChartUpdate == 0) {
      if (chartFrames >= MAWindow) {
        // debugger;
        let windowSum = 0;
        for (let i = 0; i < MAWindow; i++) {
          windowSum += window.powerSavings[window.powerSavings.length - 1 - i];
        }
        window.powerMA.shift();
        window.powerMA.push(windowSum / MAWindow);
      }
      window.updateCharts();
    }

    chartFrames++;
  }
  paintCanvas();
  var stable = true;
  for (var x = 0; x < xdim; x++) {
    var index = x + (ydim / 2) * xdim; // look at middle row only
    if (rho[index] < 0) stable = false;
  }
  if (!stable) {
    initFluid();
  }
  if (window.running) {
    const now = new Date().getTime();
    const duration = scheduledStart ? now - scheduledStart : now - start;
    scheduledStart = 1000 / 24 + start;
    window.setTimeout(simulate, 1000 / fps - duration);
  }
}

// Set the fluid variables at the boundaries, according to the current slider value:
function setBoundaries() {
  // bounds no matter what
  for (let x = 0; x < xdim; x++) {
    setEquil(x, 0, u0, 0, 1);
    setEquil(x, ydim - 1, u0, 0, 1);
  }
  for (let y = 1; y < ydim - 1; y++) {
    setEquil(0, y, u0, 0, 1);
  }
  // return;
  const eqStartPerRow = [];
  let firstBarrierX;
  let firstBarrierY;
  let lastBarrierX;
  let lastBarrierY;
  let hasBarrier = false;
  // let minBarrierX = Infinity;
  for (let y = 1; y < ydim - 1; y++) {
    let barrierFound = false;
    for (let x = 1; x < xdim - 1; x++) {
      const i = x + y * xdim;
      if (barrier[i]) {
        hasBarrier = true;
        if (firstBarrierX === undefined) {
          firstBarrierX = x;
          firstBarrierY = y;
        }
        // minBarrierX = Math.min(minBarrierX, x);
        lastBarrierX = x;
        lastBarrierY = y;
        eqStartPerRow.push(x);
        barrierFound = true;
        break;
      }
    }
    if (!barrierFound) {
      eqStartPerRow.push(undefined);
    }
  }

  if (!hasBarrier) return;
  // debugger;
  for (let y = ydim - 3; y >= lastBarrierY - 1; y--) {
    eqStartPerRow[y] = lastBarrierX;
  }
  for (let y = lastBarrierY - 2; y >= 0; y--) {
    eqStartPerRow[y] = Math.min(
      eqStartPerRow[y] || Infinity,
      eqStartPerRow[y + 1]
    );
  }

  const eqOffset = Math.round(xdim * 0.15);
  // debugger;
  for (var y = 1; y < ydim - 1; y++) {
    for (let x = 1; x < eqStartPerRow[y - 1] - eqOffset; x++) {
      setEquil(x, y, u0, 0, 1);
      // colorSquare(x, y, 0, 0, 0, 255);
      // context.putImageData(image, 0, 0);
    }
  }
  // debugger;
  // paintCanvas();
  // debugger;
}

// Collide particles within each cell (here's the physics!):
function collide() {
  var omega = 1 / (3 * viscosity + 0.5); // reciprocal of relaxation time
  for (var y = 1; y < ydim - 1; y++) {
    for (var x = 1; x < xdim - 1; x++) {
      var i = x + y * xdim; // array index for this lattice site
      if (barrier[i]) {
        continue;
      }
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
      // if (!thisrho) {
      //   continue;
      // }
      rho[i] = thisrho;
      // if (isNaN(rho[i])) {
      //   debugger;
      // }
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

      n0[i] += omega * (four9ths * thisrho * (1 - u215) - n0[i]);
      nE[i] += omega * (one9thrho * (1 + ux3 + 4.5 * ux2 - u215) - nE[i]);
      nW[i] += omega * (one9thrho * (1 - ux3 + 4.5 * ux2 - u215) - nW[i]);
      nN[i] += omega * (one9thrho * (1 + uy3 + 4.5 * uy2 - u215) - nN[i]);
      nS[i] += omega * (one9thrho * (1 - uy3 + 4.5 * uy2 - u215) - nS[i]);
      nNE[i] +=
        omega *
        (one36thrho * (1 + (ux3 + uy3) + 4.5 * (u2 + uxuy2) - u215) - nNE[i]);
      nSE[i] +=
        omega *
        (one36thrho * (1 + (ux3 - uy3) + 4.5 * (u2 - uxuy2) - u215) - nSE[i]);
      nNW[i] +=
        omega *
        (one36thrho * (1 - (ux3 - uy3) + 4.5 * (u2 - uxuy2) - u215) - nNW[i]);
      nSW[i] +=
        omega *
        (one36thrho * (1 - (ux3 + uy3) + 4.5 * (u2 + uxuy2) - u215) - nSW[i]);
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
  const scalar = 1; //0.15;
  for (var y = ydim - 2; y > 0; y--) {
    // first start in NW corner...
    for (var x = 1; x < xdim - 1; x++) {
      nN[x + y * xdim] = nN[x + (y - 1) * xdim]; // move the north-moving particles
      nNW[x + y * xdim] =
        scalar * nNW[x + 1 + (y - 1) * xdim] + (1 - scalar) * nNW[x + y * xdim]; // and the northwest-moving particles
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
      nW[x + y * xdim] =
        scalar * nW[x + 1 + y * xdim] + (1 - scalar) * nW[x + y * xdim]; // move the west-moving particles
      nSW[x + y * xdim] =
        scalar * nSW[x + 1 + (y + 1) * xdim] + (1 - scalar) * nSW[x + y * xdim]; // and the southwest-moving particles

      // if (isNaN(nSW[x + y * xdim])) {
      //   debugger;
      // }
    }
  }
  for (var y = 1; y < ydim - 1; y++) {
    // Now handle bounce-back from barriers
    for (var x = 1; x < xdim - 1; x++) {
      if (barrier[x + y * xdim]) {
        var index = x + y * xdim;
        nE[x + 1 + y * xdim] = nW[index];
        nW[x - 1 + y * xdim] = 1 * nE[index];
        nN[x + (y + 1) * xdim] = nS[index];
        nS[x + (y - 1) * xdim] = nN[index];
        nNE[x + 1 + (y + 1) * xdim] = nSW[index];
        nNW[x - 1 + (y + 1) * xdim] = 1 * nSE[index];
        nSE[x + 1 + (y - 1) * xdim] = nNW[index];
        nSW[x - 1 + (y - 1) * xdim] = 1 * nNE[index];
        // Keep track of stuff needed to plot force vector:
        absorbedX +=
          nE[index] +
          nSE[index] +
          nNE[index] -
          nNW[index] -
          nW[index] -
          nSW[index];
        absorbedY +=
          nS[index] +
          nSW[index] +
          nSE[index] -
          nN[index] -
          nNE[index] -
          nNW[index];
        nW[index] = 0;
        nN[index] = 0;
        nE[index] = 0;
        nS[index] = 0;
        nNW[index] = 0;
        nSW[index] = 0;
        nNE[index] = 0;
        nSE[index] = 0;
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
  // checkForNaN(i);
  n0[i] = four9ths * newrho * (1 - u215);
  nE[i] = one9th * newrho * (1 + ux3 + 4.5 * ux2 - u215);
  nW[i] = one9th * newrho * (1 - ux3 + 4.5 * ux2 - u215);
  nN[i] = one9th * newrho * (1 + uy3 + 4.5 * uy2 - u215);
  nS[i] = one9th * newrho * (1 - uy3 + 4.5 * uy2 - u215);
  nNE[i] = one36th * newrho * (1 + (ux3 + uy3) + 4.5 * (u2 + uxuy2) - u215);
  nSE[i] = one36th * newrho * (1 + (ux3 - uy3) + 4.5 * (u2 - uxuy2) - u215);
  nNW[i] = one36th * newrho * (1 - (ux3 - uy3) + 4.5 * (u2 - uxuy2) - u215);
  nSW[i] = one36th * newrho * (1 - (ux3 + uy3) + 4.5 * (u2 + uxuy2) - u215);
  rho[i] = newrho;
  ux[i] = newux;
  uy[i] = newuy;
}

function valToColor(c, opacityScale = 1) {
  let hue;
  let opacity = sigmoid(Math.abs(c) * 80 * opacityScale) * 2 - 1;
  if (c < 0) {
    hue = 0.16 - 0.16 * (sigmoid(-c * 50) * 2 - 1);
  } else {
    hue = 0.52 + 0.14 * (sigmoid(c * 50) * 2 - 1);
  }
  const rgb = hslToRgb(hue, 1, 0.6);
  rgb.push(opacity * 255);
  return rgb;
}

function paintCanvas() {
  // barrierContext.putImageData(barrierImage, 0, 0);
  if (plotType == 0) {
    computeCurl();
  }
  // const [Fx, Fy] = computeNaturalForce();
  // forceSum += Fx;
  // naturalForces.push(Fx);
  // if (naturalForces.length > MAWindow) {
  //   forceSum -= naturalForces[naturalForces.length - MAWindow - 1];
  //   naturalForces.shift();
  //   forceAvg = forceSum / MAWindow;
  // }
  // if (c) {
  //   const forceSaved = c * (topForce - Fx);
  //   window.forceSavings.push(forceSaved);
  //   forceSavedElement.innerHTML = Math.round(forceSaved * 10) / 10;
  //   const powerSaved = forceSaved * speedInMPS;
  //   window.powerSavings.push(powerSaved);
  //   powerSavedElement.innerHTML = Math.round(powerSaved);
  //   window.forceSavings.shift();
  //   window.powerSavings.shift();
  //   if (chartFrames % (fps / chartUpdatesPerSecond) == 0) {
  //     if (window.powerSavings[window.powerSavings.length - MAWindow]) {
  //       let powerMAVal = 0;
  //       for (let i = 0; i < MAWindow; i++) {
  //         powerMAVal += window.powerSavings[window.powerSavings.length - i - 1];
  //       }
  //       powerMAVal /= MAWindow;
  //       if (
  //         window.powerMA.length ==
  //         chartMaxSeconds * chartUpdatesPerSecond + 1
  //       ) {
  //         window.powerMA.shift();
  //       }
  //       window.powerMA.push(powerMAVal);
  //     }
  //     window.updateCharts();
  //   }
  //   chartFrames++;
  // }

  for (var y = 1; y < ydim - 1; y++) {
    for (var x = 1; x < xdim - 1; x++) {
      if (barrier[x + y * xdim]) {
        colorSquare(x, y, 0, 0, 0, 160);
      } else {
        let rgba;
        let opacity = 1;
        let saturation = 1;
        if (plotType == 0) {
          rgba = valToColor(curl[x + y * xdim]);
        } else if (plotType == 1) {
          rgba = valToColor(0.5 * (ux[x + y * xdim] - u0), 0.5);
          // const hue = sigmoid(ux[x + y * xdim] * 30);
          // rgb = hslToRgb(hue, 1, 0.6);
        } else if (plotType == 2) {
          rgba = valToColor(uy[x + y * xdim], 1);
        } else if (plotType == 3) {
          const speedX = ux[x + y * xdim];
          const speedY = uy[x + y * xdim];
          const speed = Math.sqrt(speedX * speedX + speedY * speedY) - u0;
          rgba = valToColor(0.5 * speed, 0.5);
        } else if (plotType == 4) {
          rgba = valToColor(0.5 * (rho[x + y * xdim] - 1));
        }

        colorSquare(x - 1, y + 1, rgba[0], rgba[1], rgba[2], rgba[3]);
      }
    }
  }
  //if (pixelGraphics)
  context.putImageData(image, 0, 0); // blast image to the screen
}

function sigmoid(x) {
  const exp = Math.exp(x);
  return exp / (1 + exp);
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
  // paintCanvas();
}

initFluid(); // initialize to steady rightward flow

function hslToRgb(h, s, l) {
  // 0 to 1, 0-1, 0-1
  // Convert HSL to RGB
  h = h % 1;
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // Achromatic when saturation is 0
  } else {
    const hueToRgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hueToRgb(p, q, h + 1 / 3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1 / 3);
  }
  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);

  // Scale to 0-255 and round to integers
  return [r, g, b];
}
