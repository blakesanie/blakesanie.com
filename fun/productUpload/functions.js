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

function submit() {
  var name = $("#name").val();
  var category = $("#category").val();
  var tags = $("#tags").val();
  var thumbUrl = encodeURIComponent($("#thumbUrl").val());
  var amazonUrl = encodeURIComponent($("#amazonUrl").val());
  var price = $("#price").val();
  var isGift = false;
  if ($("#isGift").val() == "true") {
    isGift = true;
  }
  $.ajax({
    url:
      "localhost:3000/postproduct?name=" +
      name +
      "&cat=" +
      category +
      "&thumbUrl=" +
      thumbUrl +
      "&amazonUrl=" +
      amazonUrl +
      "&tags=" +
      tags +
      "&price=" +
      price +
      "&isGift=" +
      isGift,
    success: function(result, status, error) {
      console.log(result);
      console.log(status);
      console.log(error);
      if (result == "posted") {
        alert("product posted");
      }
    },
    error: function(xhr, status, error) {
      alert(xhr.responseText);
      console.log(xhr);
      console.log(status);
      console.log(error);
    }
  });
}

/*
"https://mobile-store-blakesanie.herokuapp.com/postproduct?name=" +
      name +
      "&cat=" +
      category +
      "&thumbUrl=" +
      thumbUrl +
      "&amazonUrl=" +
      amazonUrl +
      "&tags=" +
      tags +
      "&price=" +
      price +
      "&isGift=" +
      isGift,
      */
