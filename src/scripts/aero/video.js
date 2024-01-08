const video = document.getElementById("videoelement");

function handleSuccess(stream) {
  video.srcObject = stream;
}

async function getDevices() {
  return (await navigator.mediaDevices.enumerateDevices())
    .filter((device) => device.kind.startsWith("video"))
    .map((device) => device.deviceId);
}

async function setDevice() {
  window.cameraId = devices[deviceI];
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      deviceId: {
        exact: window.cameraId,
      },
    },
  });
  video.srcObject = stream;
}

let devices;
let deviceI = 0;

async function videoMain() {
  devices = await getDevices();
  await setDevice();
}

videoMain();

async function toggleCamera() {
  deviceI = (i + 1) % devices.length;
  await setDevice();
}
