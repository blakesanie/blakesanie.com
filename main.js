if(!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
 $(".contactCardDownload").remove();
}

var menuExpanded = false;
var menuAltered = false;

$("#menuIcon").click(function() {
  if (menuExpanded) {
    $("#nav").css("opacity", "0");
    $("#nav").css("pointer-events", "none");
    $("#menuIcon").css("transform", "rotate(0)");
  } else {
    $("#nav").css("opacity", "1");
    $("#nav").css("pointer-events", "all");
    $("#menuIcon").css("transform", "rotate(90deg)");
  }
  menuExpanded = !menuExpanded;
  menuAltered = true;
});

var current = 0;
var prev = 0;
var showing = true;

function positionHeader() {
  if ($(window).width() <= 800 && !menuExpanded) {
    current = $(this).scrollTop();
    var rate = current - prev; //+ = down, - = up
    if (current <= 100 && current >= 0) {
      if (!(showing && rate < 0)) {
        $("#header").css({
          transition: "background-color 0.2s ease",
          transform: "translateY(" + -current + "px)"
        });
        showing = false;
      }
    } else {
      console.log("should enable transition");
      $("#header").css(
        "transition",
        "transform 0.3s ease, background-color 0.2s ease"
      );
      if (rate > 0 && current >= 200) {
        $("#header").css("transform", "translateY(-100%)");
        showing = false;
      } else if (rate < -12) {
        $("#header").css("transform", "translateY(0)");
        showing = true;
      }
    }
    prev = $(this).scrollTop();
  }
}

function navOpacity() {
  if ($(window).width() <= 800) {
    if (menuExpanded) {
      $("#nav").css("opacity", "1");
      $("#nav").css("pointer-events", "all");
    } else {
      $("#nav").css("opacity", "0");
      $("#nav").css("pointer-events", "none");
    }
    setTimeout(function() {
      $("#nav").css("transition", "opacity 0.2s ease");
    }, 200);
  } else {
    $("#nav").css("opacity", "1");
    $("#nav").css("pointer-events", "all");
    $("#nav").css("transition", "none");
  }
}

$(window).resize(function() {
  positionHeader();
  navOpacity();
});
$(window).scroll(function() {
  positionHeader();
});
