const video = document.getElementById("videoelement");
const toggleButton = document.getElementById("toggleCamera");
toggleButton.addEventListener("click", toggleCamera);

function handleSuccess(stream) {
  video.srcObject = stream;
}

// async function getDevices() {
//   await navigator.mediaDevices.getUserMedia({ video: true });
//   const allDevices = await navigator.mediaDevices.enumerateDevices();
//   console.log("all Devices", allDevices);
//   return allDevices
//     .filter((device) => device.kind.startsWith("video"))
//     .map((device) => device.deviceId);
// }

async function setDevice() {
  // const cameraId = devices[deviceI];
  const mode = facingUser ? "user" : "environment";
  console.log("facing mode", mode);
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: {
        exact: mode,
      },
    },
  });
  // console.log("new device stream", stream, devices, cameraId);
  video.srcObject = stream;
  await window.setMLCam(mode);
}

let facingUser = true;

async function videoMain() {
  // devices = await getDevices();
  await setDevice();
}
videoMain();

async function toggleCamera() {
  // console.log("devices", devices);
  // deviceI = (deviceI + 1) % devices.length;
  facingUser = !facingUser;
  await setDevice();
}

function setShowVideo(show) {
  video.style.display = show ? "block" : "none";
}

const videoSelect = document.querySelector("#videoSelect");
setShowVideo(videoSelect.value);
videoSelect.addEventListener("change", (e) => {
  setShowVideo(e.target.value);
});
