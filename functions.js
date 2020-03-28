// if (window.screen.width > window.screen.height) {
//   randomImage =
//     landscapeFilenames[Math.floor(Math.random() * landscapeFilenames.length)];
// } else {
//   randomImage =
//     portraitFilenames[Math.floor(Math.random() * portraitFilenames.length)];
// }
//
// $("#content").css(
//   "background-image",
//   "url('/images/full/" + randomImage + "')"
// );

$(window).scroll(function() {
  var amountScrolled = $(document).scrollTop();
  $(".section").each(function() {
    if (amountScrolled > $(this).offset().top - $(window).height()) {
      var offset = amountScrolled - $(this).offset().top;
      // if ($(this).offset().top != 0) {
      //   offset += $(this).height();
      // }
      $(this)
        .find("h1")
        .css({
          transform: "translateY(" + offset * -0.5 + "px)"
        });
      $(this)
        .find("h2, .buttons")
        .css({
          transform: "translateY(" + offset * -0.3 + "px)"
        });
      $(this)
        .find("h1 span")
        .css({
          transform: "translateY(" + offset * 0.25 + "px)"
        });
      $(this)
        .find(".bg")
        .css({
          opacity: 1 - Math.abs(offset) / $(window).height()
        });
    }
  });
});

$("#content h1").typed({
  strings: ["Hi, I'm Blake.<span>Scroll to learn about me!</span>"],
  // typing speed
  typeSpeed: 5,
  // time before typing starts
  startDelay: 1000,
  // backspacing speed
  backSpeed: 5,
  // time before backspacing
  backDelay: 10000,
  // loop
  loop: true,
  showCursor: false
});

// $("#content h3").typed({
//   strings: ["Scroll to learn about me!"],
//   // typing speed
//   typeSpeed: 10,
//   // time before typing starts
//   startDelay: 3000,
//   // backspacing speed
//   backSpeed: 5,
//   // time before backspacing
//   backDelay: 7000,
//   // loop
//   loop: true,
//   showCursor: false
// });
