const packages = [
  "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js",
  "https://cdn.jsdelivr.net/npm/@tensorflow-models/deeplab@0.2.2/dist/deeplab.min.js",
];

function loadPackage(url) {
  return new Promise((resolve, reject) => {
    let s = document.createElement("script");
    s.type = "text/javascript";
    s.onload = resolve;
    s.src = url;
    document.head.appendChild(s);
  });
}

async function mlMain() {
  // await Promise.all(packages.map((pack) => loadPackage(pack)));
  console.log("all loaded!");
  const modelName = "pascal"; // set to your preferred model, either `pascal`, `cityscapes` or `ade20k`
  const quantizationBytes = 2; // either 1, 2 or 4
  const model = await deeplab.load({ base: modelName, quantizationBytes });

  //   const input = tf.zeros([1080, 1920, 3]);
  //   // debugger;
  //   // ...
  //   const start = new Date();
  //   model
  //     .segment(input)
  //     .then((out) =>
  //       console.log(`predicted in ${new Date().getTime() - start.getTime()}`, out)
  //     );

  const cam = await tf.data.webcam(document.getElementById("videoelement"));
  console.log("cam", cam);
  async function captureIteration() {
    const frame = await cam.capture();
    const [height, width, depth] = frame.shape;
    const newHeight = (width / 16) * 9;
    const y1 = (height - newHeight) / 2 / height;

    const expanded = frame.expandDims(0);
    tf.dispose(frame);
    const cropped = tf.image.cropAndResize(
      expanded,
      [[y1, 1, 1 - y1, 0]],
      [0],
      [720, 1280]
    );
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
    const passing = output.equal(15);
    tf.dispose(output);
    const subjects = passing.squeeze();
    tf.dispose(passing);
    // const output = await model.predict(cropped.squeeze());
    // const subjects = output.equal(15);
    // console.log("out", output, output.print(), subjects);

    // await tf.browser.toPixels(
    //   tf.cast(subjects, "float32"),
    //   document.getElementById("barrierCanvas")
    // );

    // debugger;
    window.newBoundaries = await subjects.data();
    tf.dispose(subjects);
    // output.dispose();
    // subjects.dispose();
    // tf.disposeVariables();
    // setTimeout(captureIteration, 0);
  }
  while (true) {
    await captureIteration();
    // tf.disposeVariables();
  }

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
