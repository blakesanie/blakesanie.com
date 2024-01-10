const packages = [
  "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js",
  "https://cdn.jsdelivr.net/npm/@tensorflow-models/deeplab@0.2.2/dist/deeplab.min.js",
];
// this.webcamVideoElement.play

function loadPackage(url) {
  return new Promise((resolve, reject) => {
    let s = document.createElement("script");
    s.type = "text/javascript";
    s.onload = resolve;
    s.src = url;
    document.head.appendChild(s);
  });
}

window.resumeML = async function () {
  while (window.running) {
    await captureIteration();
    // console.log(tf.memory().numTensors);
    // tf.disposeVariables();
  }
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

//   const input = tf.zeros([1080, 1920, 3]);
//   // debugger;
//   // ...
//   const start = new Date();
//   model
//     .segment(input)
//     .then((out) =>
//       console.log(`predicted in ${new Date().getTime() - start.getTime()}`, out)
//     );

async function captureIteration() {
  const frame = await cam.capture();
  const [height, width, depth] = frame.shape;
  const newHeight = (width / 16) * 9;
  const y1 = (height - newHeight) / 2 / height;

  const expanded = frame.expandDims(0);
  tf.dispose(frame);
  let box = window.directionRight ? [y1, 1, 1 - y1, 0] : [y1, 0, 1 - y1, 1];
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
  const passing = unsqueezed2.equal(15);
  tf.dispose(unsqueezed2);

  const subjects = passing; //blurImage(passing, kernel);

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
    [54, 96]
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

async function mlMain() {
  // await Promise.all(packages.map((pack) => loadPackage(pack)));
  console.log("all loaded!");
  const modelName = "pascal"; // set to your preferred model, either `pascal`, `cityscapes` or `ade20k`
  const quantizationBytes = 2; // either 1, 2 or 4
  model = await deeplab.load({ base: modelName, quantizationBytes });
  // debugger;
  cam = await tf.data.webcam(undefined, {
    resizeWidth: 600,
    resizeHeight: 450,
  });
  // return;

  window.resumeML();

  // const downsized = tf.image
  //   .cropAndResize(
  //     output.expandDims(2).expandDims(0),
  //     [[0, 0, 1, 1]],
  //     [0],
  //     [54, 96]
  //   )
  //   .squeeze()
  //   .squeeze();
}

mlMain();
