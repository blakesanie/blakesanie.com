$("body").on("click", ".result", function() {
  if (
    confirm(
      `Add song "${$(this)
        .find(".songTitle")
        .text()
        .trim()}" to queue?`
    )
  ) {
    alert("Success! Your song will play soon.");
  }
});
