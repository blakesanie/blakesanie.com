if (window.screen.width > window.screen.height) {
  randomImage =
    landscapeFilenames[Math.floor(Math.random() * landscapeFilenames.length)];
} else {
  randomImage =
    portraitFilenames[Math.floor(Math.random() * portaitFilenames.length)];
}

$("#content").css(
  "background-image",
  "url('/images/full/" + randomImage + "')"
);
