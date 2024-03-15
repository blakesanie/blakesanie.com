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
  window.mlRunning = false;
  // const cameraId = devices[deviceI];
  let mode = window.facingUser ? "user" : "environment";
  if (window.facingUser) {
    document.body.classList.remove("facingEnv");
  } else {
    document.body.classList.add("facingEnv");
  }
  console.log("facing mode", mode);
  let stream;
  try {
    await window.setMLCam(mode);
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: {
          exact: mode,
        },
      },
    });
  } catch (e) {
    mode = undefined;
    await window.setMLCam(mode);
    window.facingUser = undefined;
    stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
  }
  // console.log("new device stream", stream, devices, cameraId);
  video.srcObject = stream;
  // window.mlRunning = true;
  window.resumeML();
}

window.facingUser = true;

async function videoMain() {
  // devices = await getDevices();

  await setDevice();
}
videoMain();

async function toggleCamera() {
  if (window.facingUser === undefined) {
    return;
  }
  // console.log("devices", devices);
  // deviceI = (deviceI + 1) % devices.length;
  window.facingUser = !window.facingUser;
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
