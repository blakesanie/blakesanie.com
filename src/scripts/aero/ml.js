// const canvas = document.createElement("canvas");
// const ctx = canvas.getContext("2d");
// ctx.canvas.height = 1080;
// ctx.canvas.width = 1920;
// ctx.drawImage(img, 0, 0);

window.mlRunning = false;

window.resumeML = async function () {
  // debugger;
  if (window.mlRunning) return;
  window.mlRunning = true;
  while (!model || !cam) {
    await window.sleep(10);
  }
  await captureIteration();
  while (window.running && window.mlRunning) {
    await captureIteration();
    // console.log(tf.memory().numTensors);
    // tf.disposeVariables();
  }
  window.mlRunning = false;
};

function get1dGaussianKernel(sigma, size) {
  // Generate a 1d gaussian distribution across a range
  var x = tf.range(Math.floor(-size / 2) + 1, Math.floor(size / 2) + 1);
  x = tf.pow(x, 2);
  x = tf.exp(x.div(-2.0 * (sigma * sigma)));
  x = x.div(tf.sum(x));
  return x;
}

function get2dGaussianKernel(size, sigma) {
  sigma = sigma || 0.3 * ((size - 1) * 0.5 - 1) + 0.8;
  return tf.tidy(() => {
    // This default is to mimic opencv2.

    var kerne1d = get1dGaussianKernel(sigma, size);
    return tf.outerProduct(kerne1d, kerne1d).expandDims(2).expandDims(2);
  });
}

function blurImage(image, kernel) {
  const asFloat = tf.cast(image, "float32");
  tf.dispose(image);
  const conved = tf.depthwiseConv2d(asFloat, kernel, 1, "same");
  tf.dispose(asFloat);
  const greater = conved.greater(0.5);
  tf.dispose(conved);
  return greater;
}

const kernel = get2dGaussianKernel(20, 10);

async function captureIteration() {
  console.log("capturing from cam", cam);
  let frame;
  frame = await cam.capture(); //tf.browser.fromPixels(document.querySelector("img"));
  console.log("got frame!");
  // debugger;
  const [height, width, depth] = frame.shape;
  const newHeight = (width / 16) * 9;
  const y1 = (height - newHeight) / 2 / height;

  const expanded = frame.expandDims(0);
  tf.dispose(frame);
  let shouldInvertX = Boolean(window.directionRight);
  if (window.facingUser === false) {
    shouldInvertX = !shouldInvertX;
  }
  console.log(
    "SHOULD INVERT TENSOR",
    shouldInvertX,
    window.facingUser,
    !window.facingUser && !(window.facingUser === undefined)
  );
  let box = shouldInvertX ? [y1, 1, 1 - y1, 0] : [y1, 0, 1 - y1, 1];
  const cropped = tf.image.cropAndResize(expanded, [box], [0], [720, 1280]);
  tf.dispose(expanded);
  // frame.dispose();
  // debugger;
  // await tf.browser.toPixels(
  //   cropped.squeeze().mul(1 / 255),
  //   document.getElementById("physicsCanvas")
  // );
  // return;
  // console.log("cropped", cropped);

  // const output = await model.segment(cropped.squeeze(), {
  //   canvas: document.getElementById("physicsCanvas"),
  // });
  const squeezed = cropped.squeeze();
  tf.dispose(cropped);
  const output = await model.predict(squeezed);
  tf.dispose(squeezed);
  const unsqueezed1 = output.expandDims(2);
  tf.dispose(output);
  const unsqueezed2 = unsqueezed1.expandDims(0);
  tf.dispose(unsqueezed1);
  const passingBike = unsqueezed2.equal(2);
  const passingPerson = unsqueezed2.equal(15);
  tf.dispose(unsqueezed2);

  const subjects = passingBike.add(passingPerson); //blurImage(passing, kernel);
  tf.dispose(passingBike);
  tf.dispose(passingPerson);

  // const squeeze1 = subjects.squeeze();

  // const higherResSqueezed = squeeze1.squeeze();
  // tf.dispose(squeeze1);
  // const higherRes = await higherResSqueezed.data();
  // tf.dispose(higherResSqueezed);
  box = [1, 0, 0, 1];
  const croppedSubjects = tf.image.cropAndResize(
    subjects,
    [box],
    [0],
    [window.ydim - 2, window.xdim - 2]
  );
  tf.dispose(subjects);
  const croppedSqueezed1 = croppedSubjects.squeeze();
  tf.dispose(croppedSubjects);
  const croppedSubjects2d = croppedSqueezed1.squeeze();
  tf.dispose(croppedSqueezed1);
  let higherRes;
  const out = [higherRes, 0];
  out[1] = await croppedSubjects2d.data();
  window.newBoundaries = out;
  tf.dispose(croppedSubjects2d);
  // output.dispose();
  // subjects.dispose();
  // tf.disposeVariables();
  // setTimeout(captureIteration, 0);
}

let model;
let cam;

window.setMLCam = async function (mode) {
  while (window.mlRunning) {
    await window.sleep(20);
  }
  const options = {
    resizeWidth: 600,
    resizeHeight: 450,
    // deviceId: id,
  };
  if (mode) {
    options.facingMode = mode;
  }
  console.log("get cam with options", options);
  cam = await tf.data.webcam(undefined, options);
  console.log("set new cam!", cam);
};

// let img;

async function modelInit() {
  const start = new Date();
  const modelName = "pascal"; // set to your preferred model, either `pascal`, `cityscapes` or `ade20k`
  const quantizationBytes = 1; // either 1, 2 or 4
  model = await deeplab.load({ base: modelName, quantizationBytes });
  console.log("model loaded in", new Date() - start);
  // img = document.createElement("img");
  // img.onload = function () {
  //   debugger;
  //   captureIteration();
  // };
  // img.src = "/assets/cycle2.jpg";

  // document.body.append(img);
}

modelInit();
window.resumeML();
