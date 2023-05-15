var largeImages = [];
var pixelData;
var mosaic = document.getElementById("mosaic");
var mosaicCtx;

var width;
$("#generate").click(async function () {
  var albumCovers = await getAllAlbumCovers();
  if (albumCovers.length == 0) {
    alert("Select at least one playlist to create your mosaic.");
    return;
  }
  var aspectRatio = $("img").height() / $("img").width();
  width = 1;
  while (true) {
    var height = Math.floor(width * aspectRatio);
    var numTiles = width * height;
    if (numTiles > $("#slider").val()) {
      //default slider val is 1000
      width--;
      break;
    }
    width++;
  }
  var height = Math.floor(width * aspectRatio);
  mosaic.width = width * 64;
  mosaic.height = height * 64;
  mosaicCtx = mosaic.getContext("2d");
  var img = new Image();
  img.crossOrigin = "";
  img.src = $("img").attr("src");
  var canvas = document.getElementById("canvas");
  canvas.width = width;
  canvas.height = height;
  var ctx = canvas.getContext("2d");
  img.onload = function () {
    ctx.drawImage(img, 0, 0, width, height);
    var rawPixelData = ctx.getImageData(0, 0, width, height).data;
    pixelData = [];
    for (i = 0; i < rawPixelData.length; i += 4) {
      var obj = {
        r: rawPixelData[i],
        g: rawPixelData[i + 1],
        b: rawPixelData[i + 2],
      };
      pixelData.push(obj);
    }
    sizeImages();
    for (var i = 0; i < pixelData.length; i++) {
      var pixel = pixelData[i];
      var indexOfClosest = getIndexOfClosestAc(pixel, albumCovers);
      addImageToMosaic(albumCovers[indexOfClosest].small.url, i);
    }
  };
});

function getIndexOfClosestAc(pixel, albumCovers) {
  var recordDeviation = getColorDeviation(pixel, albumCovers[0].color);
  var recordIndex = 0;
  for (var i = 1; i < albumCovers.length; i++) {
    var dev = getColorDeviation(pixel, albumCovers[i].color);
    if (dev < recordDeviation) {
      recordDeviation = dev;
      recordIndex = i;
    }
  }
  return recordIndex;
}

function getColorDeviation(color1, color2) {
  return (
    (color1.r - color2.r) * (color1.r - color2.r) +
    (color1.g - color2.g) * (color1.g - color2.g) +
    (color1.b - color2.b) * (color1.r - color2.b)
  );
}

var imagesRendered = 0;
function addImageToMosaic(url, index) {
  var yOffset = Math.floor(index / width);
  var xOffset = index - yOffset * width;
  var img = new Image();
  img.crossOrigin = "";
  img.src = url;
  img.onload = function () {
    mosaicCtx.drawImage(img, xOffset * 64, yOffset * 64, 64, 64);
    imagesRendered++;
    if (imagesRendered == pixelData.length) {
      setUpDownload();
    }
  };
}

function setUpDownload() {
  imagesRendered = 0;
  var dataURL = mosaic.toDataURL("image/png");
  $("#download").attr("href", dataURL);
}

async function getAllAlbumCovers() {
  var albumCovers = [];
  for (var playlist of data.playlists) {
    if (playlist.selected == true) {
      for (var albumCover of playlist.albumCovers) {
        var isDuplicate = false;
        var id = albumCover.id;
        for (var ac of albumCovers) {
          if (ac.id == id) {
            isDuplicate = true;
            break;
          }
        }
        if (!isDuplicate) {
          var obj = albumCover;
          obj.color = await getImageColor(obj.small.url);
          albumCovers.push(albumCover);
        }
      }
    }
  }
  return albumCovers;
}

async function getImageColor(url) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.crossOrigin = "";
    img.src = url;
    img.onload = function () {
      color = getAverageRGB(img);
      resolve(color);
    };
    img.onerror = function () {
      reject(new Error("image load failed"));
    };
  });
}

function getAverageRGB(imgEl) {
  var blockSize = 5, // only visit every 5 pixels
    defaultRGB = { r: 0, g: 0, b: 0 }, // for non-supporting envs
    canvas = document.createElement("canvas"),
    context = canvas.getContext && canvas.getContext("2d"),
    data,
    width,
    height,
    i = -4,
    length,
    rgb = { r: 0, g: 0, b: 0 },
    count = 0;

  if (!context) {
    return defaultRGB;
  }

  height = canvas.height =
    imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
  width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

  context.drawImage(imgEl, 0, 0);

  try {
    data = context.getImageData(0, 0, width, height);
  } catch (e) {
    /* security error, img on diff domain */
    return defaultRGB;
  }

  length = data.data.length;

  while ((i += blockSize * 4) < length) {
    ++count;
    rgb.r += data.data[i];
    rgb.g += data.data[i + 1];
    rgb.b += data.data[i + 2];
  }

  // ~~ used to floor values
  rgb.r = ~~(rgb.r / count);
  rgb.g = ~~(rgb.g / count);
  rgb.b = ~~(rgb.b / count);

  return rgb;
}

$("#fileInput").change(function (e) {
  for (var i = 0; i < e.originalEvent.srcElement.files.length; i++) {
    var file = e.originalEvent.srcElement.files[i];
    var reader = new FileReader();
    reader.onloadend = function () {
      $("#samplePic").attr("src", reader.result);
      sizeImages();
    };
    reader.readAsDataURL(file);
  }
});

$("#slider").on("input", function (slider) {
  var currentVal = slider.currentTarget.value;
  $("#numTiles").text("Max # Tiles: " + currentVal);
});

$(window).resize(function () {
  sizeImages();
});

sizeImages();

function sizeImages() {
  var sampleHeight = Math.max($("#samplePic").height(), 1);
  var sampleWidth = Math.max($("#samplePic").width(), 1);
  var newWidth;
  if (
    (($(window).height() - 60) / sampleHeight) * sampleWidth <
    $(window).width() / 2 - 50
  ) {
    newWidth = (($(window).height() - 60) / sampleHeight) * sampleWidth;
  } else {
    newWidth = $(window).width() / 2 - 50;
  }
  $("#samplePic").css({
    width: newWidth + "px",
  });
  $("#mosaic").css({
    width: newWidth + "px",
    height: (newWidth / sampleWidth) * sampleHeight + "px",
  });
}
