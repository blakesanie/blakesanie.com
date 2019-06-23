var position = 0; //0 for left, 1 for middle, 2 for right
var classShort;
var className;
var data;

getNotes();

$("body").on("click", ".class", function() {
  classShort = $(this)
    .find("h3")
    .text();
  className =
    classShort +
    " - " +
    $(this)
      .find("h4")
      .text();
  $("#backButton p").text(classShort);
  $("#backButton").addClass("visible");
  $("#container").addClass("middle");
  setNotes();
  position = 1;
});

$("#backButton").on("click", function(event) {
  if (position == 2) {
    $("#container").removeClass("right");
    $("#backButton").removeClass("shiftedLeft");
    $("#noteName").removeClass("visible");
    $("html").removeClass("shiftedUp");
    $("#backButton p").text(className);
    position = 1;
    setTimeout(function() {
      $("#container").removeClass("extended");
    }, 500);
  } else {
    $("#backButton").removeClass("visible");
    $("#container").removeClass("middle");
    position = 0;
  }
});

$("body").on("click", ".note", function() {
  var noteName = $(this)
    .find("h3")
    .text();
  $("#backButton p").text(classShort + " Notes");
  $("#container").addClass("right");
  $("#container").addClass("extended");
  $("#backButton").addClass("shiftedLeft");
  $("html").addClass("shiftedUp");
  $("#noteName p").text(noteName);
  $("#noteName").addClass("visible");
  setIframe(noteName);
  position = 2;
});

function getNotes() {
  $.ajax({
    url: "https://blakesanie.github.io/Notes-Manager/notes.json",
    success: function(result) {
      data = result;
      console.log(data);
      setClasses();
    }
  });
}

function setClasses() {
  for (var key of Object.keys(data)) {
    var names = key.split(" - ");
    $("#classes").append(
      "<div class='class'><h3>" +
        names[0] +
        "</h3><h4>" +
        names[1] +
        "</h4></div>"
    );
  }
}

function setNotes() {
  $("#notes").empty();
  for (var key of Object.keys(data[className])) {
    $("#notes").append("<div class='note'><h3>" + key + "</h3></div>");
  }
}

function setIframe(noteName) {
  $("iframe").attr("src", data[className][noteName]);
}
