function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

filenames = shuffle(filenames);
for (var i = 0; i < filenames.length; i++) {
  $("#masonry").append("<img src='/images/thumbnails/" + filenames[i] + "'>");
}

var indexOfSelected = 0;

var lyout = $("#masonry").isotope({
  itemSelector: "img",
  masonry: {
    columnWidth: "img",
    gutter: 15,
    transitionDuration: "0.3s"
  }
});

lyout.imagesLoaded().progress(function() {
  lyout.isotope("layout");
});

setImageWidth();

function setImageWidth() {
  var numCollumns = Math.ceil($("#masonry").width() / 450);
  var width =
    ($("#masonry").width() - (15 * (numCollumns - 1) + 50)) / numCollumns;
  $("img").css("width", width + "px");
  console.log(width);
}

$(window).resize(function() {
  setImageWidth();
});

$("img").click(function() {
  indexOfSelected = $(this).index();
  setPhoto(indexOfSelected);
  $("#cover").css({ opacity: "1", pointerEvents: "auto" });
});

$("#exit").click(function() {
  closePhoto();
});

$("#right").click(function() {
  nextPhoto();
});

$("#left").click(function() {
  prevPhoto();
});

$(document).keydown(function(e) {
  var code = e.keyCode;
  if (code == 37) {
    prevPhoto();
  }
  if (code == 39) {
    nextPhoto();
  }
  if (code == 27) {
    closePhoto();
  }
});

function setPhoto(index) {
  var filePath = $("img")
    .eq(index)
    .attr("src");
  var newPath = filePath.replace("thumbnails", "full");
  $("#image").css("background-image", "url('" + newPath + "')");
}

function closePhoto() {
  $("#cover").css({ opacity: "0", pointerEvents: "none" });
}

function prevPhoto() {
  console.log(indexOfSelected);
  if (indexOfSelected > 0) {
    indexOfSelected--;
    setPhoto(indexOfSelected);
  }
}

function nextPhoto() {
  console.log(indexOfSelected);
  if (indexOfSelected < $("img").length) {
    indexOfSelected++;
    setPhoto(indexOfSelected);
  }
}

$("li:nth-child(n+2)").click(function() {
  var cat = $(this).text();
  var index = $(this).index();
  var temp = $("li:first-child").text();
  $("li:first-child").text(cat);
  $("li")
    .eq(index)
    .text(temp);
  cat = cat.toLowerCase().replace(/\s/g, "");
  lyout.isotope({
    filter: "." + cat
  });
  closeCats();
});

$("ul").hover(
  function() {
    expandCats();
  },
  function() {
    closeCats();
  }
);

$("ul").click(function() {
  expandCats();
});

$("body").click(function(e) {
  var x = e.originalEvent.x;
  var y = e.originalEvent.y;
  var ulMinX = $("ul").offset().left;
  var ulMaxX = ulMinX + $("ul").width();
  var ulMinY = $("ul").offset().top;
  var ulMaxY = ulMinY + $("ul").height();
  if (x < ulMinX || x > ulMaxX || y < ulMinY || y > ulMaxY) {
    closeCats();
  }
});

function expandCats() {
  $("li:nth-child(n+2)").css({
    opacity: 1,
    "line-height": "30px"
  });
}

function closeCats() {
  $("li:nth-child(n+2)").css({
    opacity: 0,
    "line-height": 0
  });
}

/*
var fs = require('fs');

fs.readdir('images/thumbnails', function(err, files) {
        if (err) throw err;
        files.forEach( function( file, index ) {
            console.log('<img src="../images/thumbnails/'+ file +'" class="all ">');
        });
} );*/
