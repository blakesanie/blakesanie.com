var expanded = false;
var currentImages = ["DSC_0831","DSC_0393","DSC_0212","DSC_0085","DSC_0473","DSC_0102","DSC_0216","DSC_0215","DSC_0168","pontAvignon","DSC_0343","DSC_0016","lakeExposure","DSC_0358","DSC_0342","DSC_0356","DSC_0817","DSC_0131","DSC_0048","DSC_0232","DSC_0463","DSC_0420","DSC_0376","DSC_0388","commonsBeachPano","DSC_0394","DSC_0709","DSC_0345","DSC_0792","DSC_0741","DSC_0475","DSC_0472","DSC_0137","DSC_0516","DSC_0292","DSC_0308","DSC_0549","DSC_0547","DSC_0554","DSC_0935","DSC_1004","CommonsBeach"];

console.log(currentImages.length)


$(document).ready(function(){
    $('.image').bind("click", function() {
        var filename = $(this).attr("src").replace("thumbs", "full");
        $("#largeImage").css("background-image", "url('"+ filename +"')");
        $("#cover").css({"opacity":"1", "pointer-events":"auto"});
    });
    $('#exit').bind("click", function() {
        console.log("exit");
        exit();
    });
    $('.rightHalf').bind("click", function() {
        console.log("right");
        nextPhoto();
    });
    $('.leftHalf').bind("click", function() {
        console.log("left");
        prevPhoto();
    });
});


$("#menuIcon").click(function() {
  toggleMenu();
});

function exit() {
    $("#cover").css({"opacity":"0", "pointer-events":"none"});
}

function toggleMenu() {
  if (expanded) {
    $("#menuIcon").css("transform", "translateY(-50%) rotate(0)");
    $("ul").css({"opacity": "0", "pointer-events": "none"});
  } else {
    $("#menuIcon").css("transform", "translateY(-50%) rotate(90deg)");
    $("ul").css({"opacity": "1", "pointer-events": "auto"});
  }
  expanded = !expanded;
}


var current = 0;
var prev = 0;
var showing = true;
var fadedIn = false;


$(window).scroll(function() {
  current = $(this).scrollTop();
  
  //dynamic menu algorithm
  var rate = current - prev; //+ = down, - = up

  if (current <= 80 && current >= 0 && !expanded) {
    if (!(showing && rate < 0)) {
    $("#header").css({
      transition: "none",
      transform: "translateY(" + -current + "px)"
    });
      showing = false;
    }
  } else {
    $("#header").css("transition", "transform 0.5s ease");
    if (rate > 0 && !expanded && current >= 160) {
      $("#header").css("transform", "translateY(-100%)");
        showing = false;
    } else if (rate < -12) {
      $("#header").css("transform", "translateY(0)");
      showing = true;
    }
  }
  prev = $(this).scrollTop();
});


//scroll to bottom
$("#connect").click(function() {
    var offset = ($(window).height() - $("#footer").height()) / 2;
  $("body").animate({ scrollTop: $("#footer").offset().top - (offset)}, 1000);
  toggleMenu();
});


//scroll to top
$("#port").click(function() {
  $("body").animate({ scrollTop: 0}, 1000);
  toggleMenu();
});

$("#gearMenu").click(function() {
  $("body").animate({ scrollTop: $("#gear").offset().top}, 1000);
  toggleMenu();
});

$("#aboutMenu").click(function() {
  $("body").animate({ scrollTop: $("#about").offset().top}, 1000);
  toggleMenu();
});

function nextPhoto() {
    var filename = $("#largeImage").css('background-image').replace(/(url\(|\)|")/g, '');
    filename = filename.split("/full/")[1].replace(".jpg","");
    var index = currentImages.indexOf(filename);
    if (index < currentImages.length - 1) {
        $("#largeImage").css("background-image","url('/photo/full/"+ currentImages[index + 1] +".jpg')");
    }
}


function prevPhoto() {
    var filename = $("#largeImage").css('background-image').replace(/(url\(|\)|")/g, '');
    filename = filename.split("/full/")[1].replace(".jpg","");
    var index = currentImages.indexOf(filename);
    if (index > 0) {
        $("#largeImage").css("background-image","url('/photo/full/"+ currentImages[index - 1] +".jpg')");
    }
}


$(document).keydown(function(e) {
    if ($("#largeImage").css("opacity") == 1) {
        if (e.keyCode == 37) {
            prevPhoto();
        }
        if (e.keyCode == 39) {
            nextPhoto();
        }
        if (e.keyCode == 27) {
            exit();
        }
    }
});

$('html').mousemove(function(e){
        var x = e.pageX - $(window).width();
        var y = e.pageY - $(window).scrollTop();
    if (x > -40 && y < 40) {
        $("#header").css("transform", "translateY(0)");
        showing = true;
    }
});

var lyout = $("#body").masonry({
    itemSelector: '.image',
    columnWidth: '.image',
    gutter: 40,
    transitionDuration: '0.3s'
});

lyout.imagesLoaded().progress( function() {
    console.log("loaded");
  lyout.masonry();
});