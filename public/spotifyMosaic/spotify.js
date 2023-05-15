var stateKey = "spotify_auth_state";

function getHashParams() {
  var hashParams = {};
  var e,
    r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
  while ((e = r.exec(q))) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

function generateRandomString(length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

var data = {};

var params = getHashParams();

var access_token = params.access_token,
  state = params.state,
  storedState = localStorage.getItem(stateKey);

$(document).on("click", "#login", async function () {
  // console.log("login click");
  var client_id = "ea58eca152454aed8601582fd602ce90"; // faked for tutorial
  var redirect_uri = window.location.href;
  //var redirect_uri = "http://localhost:8888/app.html"; // development
  var state = generateRandomString(16);
  await localStorage.setItem(stateKey, state);
  var url = "https://accounts.spotify.com/authorize";
  url += "?response_type=token";
  url += "&client_id=" + encodeURIComponent(client_id);
  url += "&redirect_uri=" + encodeURIComponent(redirect_uri);
  url += "&state=" + encodeURIComponent(state);
  // console.log(url);
  window.location.href = url;
});

if (access_token && (state == null || state !== storedState)) {
  // console.log("error");
} else {
  if (access_token) {
    $("#login").remove();
    $("#cover").append("<p id='loading'>Loading</p>");
    $.ajax({
      url: "https://api.spotify.com/v1/me",
      headers: {
        Authorization: "Bearer " + access_token,
      },
      error: function (jqXHR, status, err) {
        $("#loading").remove();
        $("#cover").append("<p id='login'>First, login With Spotify</p>");
      },
      success: async function (response) {
        data.username = response.display_name;
        data.userId = response.id;
        data.profilePic = response.images[0]
          ? response.images[0].url
          : "noImage";
        await $.ajax({
          url: "https://api.spotify.com/v1/me/playlists",
          headers: {
            Authorization: "Bearer " + access_token,
          },
          success: async function (res) {
            data.playlists = [];
            var i = 1;
            for (var playlist of res.items) {
              setLoadingMessage(
                "Analyzing " + i + " / " + res.items.length + " playlists"
              );
              data.playlists = data.playlists.concat([
                {
                  name: playlist.name,
                  length: playlist.tracks.total,
                  id: playlist.id,
                  image:
                    playlist.images[Math.min(playlist.images.length - 1, 1)]
                      .url || "noUrl",
                  selected: false,
                  albumCovers: await getAlbumCoversForPlaylist(playlist.id),
                },
              ]);
              i++;
            }
            fillInUI();
          },
        });
      },
    });
  }
}

$(document).on("click", ".playlist", function () {
  var index = $(this).index();
  var newStatus = !data.playlists[index].selected;
  data.playlists[index].selected = newStatus;
  if (newStatus) {
    $(this).addClass("selected");
  } else {
    $(this).removeClass("selected");
  }
});

function setLoadingMessage(text) {
  $("#loading").text(text);
}

function fillInUI() {
  $("#cover").css({
    opacity: "0",
  });
  setTimeout(function () {
    $("#cover").remove();
  }, 1000);
  $("#profilePic").css({
    "background-image": "url('" + data.profilePic + "')",
  });
  $("#name").text(data.username);
  for (var playlist of data.playlists) {
    var newElement =
      "<div class='playlist'><div class='playlistCover' style='background-image: url(" +
      playlist.image +
      ")'></div><h3 class='playlistName'>" +
      playlist.name +
      " (" +
      playlist.albumCovers.length +
      " album covers)" +
      "</h3></div>";
    $("#playlists").append(newElement);
  }
}

async function getAlbumCoversForPlaylist(id) {
  var albumCovers = [];
  await $.ajax({
    url: "https://api.spotify.com/v1/playlists/" + id + "/tracks",
    headers: {
      Authorization: "Bearer " + access_token,
    },
    error: function (jqXHR, status, err) {
      // console.log(err);
    },
    success: function (res) {
      for (var song of res.items) {
        var album = song.track.album;
        var isDuplicate = false;
        for (var albumCover of albumCovers) {
          if (albumCover.id == album.id) {
            isDuplicate = true;
            break;
          }
        }
        if (!isDuplicate && album.images[2]) {
          var obj = {
            id: album.id,
            small: album.images[2],
            large: album.images[1],
            name: album.name,
          };
          albumCovers.push(obj);
        }
      }
    },
  });
  return albumCovers;
}
