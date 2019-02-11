var width;
$("#generate").click(async function() {
  var albumCovers = await getAllAlbumCovers();
  if (albumCovers.length == 0) {
    alert("Select at least one playlist to create your mosaic.");
    return;
  }
  console.log(albumCovers);
  var aspectRatio = $("img").height() / $("img").width();
  width = 1;
  while (true) {
    var height = Math.floor(width * aspectRatio);
    var numTiles = width * height;
    if (numTiles > 1000 /*albumCovers.length*/) {
      width--;
      break;
    }
    width++;
  }
  var height = Math.floor(width * aspectRatio);
  console.log(width, height);
  var img = new Image();
  img.crossOrigin = "";
  img.src = $("img").attr("src");
  var canvas = document.getElementById("canvas");
  canvas.width = width; //img.naturalWidth;
  canvas.height = height; //img.naturalHeight;
  var ctx = canvas.getContext("2d");
  img.onload = function() {
    ctx.drawImage(img, 0, 0, width, height);
    rawPixelData = ctx.getImageData(0, 0, width, height).data;
    console.log(rawPixelData);
    pixelData = [];
    for (i = 0; i < rawPixelData.length; i += 4) {
      var obj = {
        r: rawPixelData[i],
        g: rawPixelData[i + 1],
        b: rawPixelData[i + 2]
      };
      pixelData.push(obj);
    }
    console.log(pixelData);
    $("#mosaic").empty();
    // for (var pixel of pixelData) {
    //   $("#mosaic").append(
    //     "<div class='pixel' style='background-color: rgb(" +
    //       pixel.r +
    //       "," +
    //       pixel.g +
    //       "," +
    //       pixel.b +
    //       ")'></div>"
    //   );
    // }
    setTileSize();
    for (var pixel of pixelData) {
      var indexOfClosest = getIndexOfClosestAc(pixel, albumCovers);
      addImageToMosaic(albumCovers[indexOfClosest].small.url, width);
    }
    setTileSize();
    // createMosaic(pixelData, width, height, albumCovers);
  };
});

// async function createMosaic(pixelData, width, height, albumCovers) {
//   var canvas = document.getElementById("mosaicCanvas");
//   canvas.width = width * 64; //img.naturalWidth;
//   canvas.height = height * 64; //img.naturalHeight;
//   var ctx = canvas.getContext("2d");
//   var i = 0;
//   for (var pixel of pixelData) {
//     var indexOfClosest = getIndexOfClosestAc(pixel, albumCovers);
//     var img = new Image();
//     img.crossOrigin = "";
//     img.src = albumCovers[indexOfClosest].small.url;
//     var y = Math.floor(i / width) * 64;
//     var x = i - y * width * 64;
//     img.onLoad = function() {
//       ctx.drawImage(img, x, y, 64, 64);
//     };
//     i++;
//   }
// }

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

function addImageToMosaic(url, width) {
  $("#mosaic").append("<img class='pixel' src='" + url + "'/>");
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

// var img = new Image();
// img.crossOrigin = "";
// img.src = $("img").attr("src");
// img.onload = function() {
//   var canvas = document.getElementById("canvas");
//   var ctx = canvas.getContext("2d");
//   ctx.drawImage(img, 50, 50);
// };

async function getImageColor(url) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.crossOrigin = "";
    img.src = url;
    img.onload = function() {
      color = getAverageRGB(img);
      resolve(color);
    };
    img.onerror = function() {
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

$("input").change(function(e) {
  for (var i = 0; i < e.originalEvent.srcElement.files.length; i++) {
    var file = e.originalEvent.srcElement.files[i];
    var reader = new FileReader();
    reader.onloadend = function() {
      $("#samplePic").attr("src", reader.result);
    };
    reader.readAsDataURL(file);
  }
});

// function changeSampleImage(image) {
//   console.log(image);
//   if (input.files && input.files[0]) {
//     var reader = new FileReader();
//
//     reader.onload = function(e) {
//       console.log(e);
//       $("#samplePic").attr("src", e.target.result);
//     };
//
//     reader.readAsDataURL(input.files[0]);
//   }
// }

$(window).resize(function() {
  sizeImages();
});

sizeImages();

function sizeImages() {
  var sampleHeight = $("#samplePic").height();
  var sampleWidth = $("#samplePic").width();
  var newWidth;
  if (
    (($("#right").width() - 40) / sampleWidth) * sampleHeight >
    $(window).height() * 0.6
  ) {
    newWidth = (($(window).height() * 0.6) / sampleHeight) * sampleWidth;
  } else {
    newWidth = $("#right").width() - 40;
  }
  var css = {
    height: "auto",
    width: newWidth + "px"
  };
  $("#samplePic").css(css);
  $("#mosaic").css(css);
  setTileSize();
}

function setTileSize() {
  var mosaicWidth = $("#mosaic").width();
  $(".pixel").css({
    width: mosaicWidth / width + "px",
    height: mosaicWidth / width + "px"
  });
}
