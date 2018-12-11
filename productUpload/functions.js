function addVersion() {
  console.log("add version");
  $("#addVersionButton").after(
    ' <div class="version item"><p>title</p><input type="text" id="title"><p>price</p><input type="number" id="price"><p>amazon URL</p><input type="text" id="amazonURL"><p>image URL</p><input type="text" class="imageUrl"><div class="img"></div><button class="remove">remove this version</button></div>'
  );
}

function addPhoto() {
  console.log("add photo");
  $("#addPhotoButton").after(
    "<div class='photo item'><p>url</p><input type='text' class='imageUrl'><div class='img'></div><button class='remove'>remove this photo</button></div>"
  );
}

function addVideo() {
  console.log("add video");
  $("#addVideoButton").after(
    "<div class='video item'><p>Youtube ID</p><input type='text' class='youtubeId'><div class='img videoThumb'></div><button class='remove'>remove this video</button></div>"
  );
}

$(document).on("click", "div button", function() {
  console.log(this);
  $(this)
    .parent()
    .remove();
});

$(document).on("change", "#thumbUrl", function() {
  $(this)
    .parent()
    .find("#thumbnail")
    .find("#thumbImg")
    .css({
      display: "block",
      "background-image": "url('" + $(this).val() + "')"
    });
});

$(document).on("change", ".imageUrl", function() {
  $(this)
    .parent()
    .find(".img")
    .css({
      display: "block",
      "background-image": "url('" + $(this).val() + "')"
    });
});

$(document).on("change", ".youtubeId", function() {
  var url = "https://img.youtube.com/vi/" + $(this).val() + "/hqdefault.jpg";
  $(this)
    .parent()
    .find(".img")
    .css({
      display: "block",
      "background-image": "url('" + url + "')"
    });
});

function getPhotos() {
  var order = $("#photoOrder")
    .val()
    .split(",");
  order = order.map(function(item) {
    return parseInt(item) - 1;
  });
  console.log(order);
  var urls = [];
  for (var index of order) {
    var url = $(".photo")
      .eq(index)
      .find(".imageUrl")
      .val();
    if (url == undefined || url == "") {
      alert("error: order does not reflect items, if they exist");
      return;
    }
    urls.push(encodeURIComponent(url));
  }
  return urls;
}

function getVideos() {
  var order = $("#videoOrder")
    .val()
    .split(",");
  order = order.map(function(item) {
    return parseInt(item) - 1;
  });
  var urls = [];
  for (var index of order) {
    var id = $(".video")
      .eq(index)
      .find(".youtubeId")
      .val();
    if (id == undefined || id == "") {
      alert("error: order does not reflect items, if they exist");
      return;
    }
    urls.push(id);
  }
  return urls;
}

function getVersions() {
  var versions = [];
  for (var i = 0; i < $(".version").length; i++) {
    var element = $(".version").eq(i);
    var title = element.find("#title").val();
    var price = parseInt(element.find("#price").val());
    var amazonUrl = element.find("#amazonUrl").val();
    var imageUrl = element.find(".imageUrl").val();
    if (element == undefined) {
      alert("error: order does not reflect items, if they exist");
      return;
    }
    versions.push({
      title: title,
      price: price,
      amazonUrl: encodeURIComponent(amazonUrl),
      imageUrl: encodeURIComponent(imageUrl)
    });
  }
  versions = versions.sort(compare);
  //console.log(versions);
  return versions;
}

function compare(a, b) {
  if (a.price < b.price) return -1;
  if (a.price > b.price) return 1;
  return 0;
}

function submit() {
  var name = $("#name").val();
  var category = $("#category").val();
  var thumbUrl = encodeURIComponent($("#thumbUrl").val());
  var photos = getPhotos();
  var videos = getVideos();
  var versions = getVersions();
  var minPrice = versions[0].price;
  var reviews = "[]";
  photos = JSON.stringify(photos);
  videos = JSON.stringify(videos);
  versions = JSON.stringify(versions);
  //console.log(versions);
  $.ajax({
    url:
      "https://mobile-store-blakesanie.herokuapp.com/postproduct?name=" +
      name +
      "&cat=" +
      category +
      "&thumbUrl=" +
      thumbUrl +
      "&photos=" +
      photos +
      "&videos=" +
      videos +
      "&versions=" +
      versions +
      "&minPrice=" +
      minPrice +
      "&reviews=" +
      reviews,
    success: function(result, status, error) {
      if (error) {
        alert(error);
      }
      console.log(result);
      console.log(status);
      console.log(error);
      if (result == "posted") {
        alert("product posted");
      }
    },
    error: function(xhr, status, error) {
      alert(error);
      console.log(xhr);
      console.log(status);
      console.log(error);
    }
  });
}
