const video = document.getElementById("videoelement");

const canvas = document.getElementById("videoCanvas");

const constraints = {
  audio: false,
  video: true,
};

function handleSuccess(stream) {
  window.stream = stream; // make stream available to browser console
  video.srcObject = stream;
  // setInterval(() => {
  //   canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
  // }, 10);
}

function handleError(error) {
  console.log(
    "navigator.MediaDevices.getUserMedia error: ",
    error.message,
    error.name
  );
}

navigator.mediaDevices
  .getUserMedia(constraints)
  .then(handleSuccess)
  .catch(handleError);
