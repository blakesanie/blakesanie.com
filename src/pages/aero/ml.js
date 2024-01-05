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
  await Promise.all(packages.map((pack) => loadPackage(pack)));
  console.log("all loaded!");
  const modelName = "pascal"; // set to your preferred model, either `pascal`, `cityscapes` or `ade20k`
  const quantizationBytes = 2; // either 1, 2 or 4
  const model = await deeplab.load({ base: modelName, quantizationBytes });

  const input = tf.zeros([1080, 1920, 3]);
  // debugger;
  // ...
  const start = new Date();
  model
    .segment(input)
    .then((out) =>
      console.log(`predicted in ${new Date().getTime() - start.getTime()}`, out)
    );
}

mlMain();
