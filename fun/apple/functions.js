var products = {};
var pageNum = 0;

$.ajax({
  url: "https://blakesanie.github.io/product-DB/products.json",
  success: function(result, status, error) {
    products = result;
    console.log(products);
    renderProducts();
  },
  error: function(xhr, status, error) {
    console.error(error);
  }
});

function renderProducts() {
  let html = "";
  let subProducts = Object.keys(products);
  for (var key of subProducts) {
    const product = products[key];
    html +=
      "<a class='product' discount='" +
      product.discount +
      "' price='" +
      product.newPrice +
      "' href='" +
      product.url +
      "' target='_blank'><img src='" +
      product.imgLarge +
      "'/><div class='titleHolder'><p class='title'>" +
      product.title +
      "</p></div><p class='price'>$" +
      product.newPrice +
      "<span class='oldPrice'>$" +
      product.oldPrice +
      "</span></p></a>";
  }
  $("#products").html(html);
  html = $(".product").sort(function(a, b) {
    var contentA = parseFloat($(a).attr("discount"));
    var contentB = parseFloat($(b).attr("discount"));
    return contentA < contentB ? 1 : contentA > contentB ? -1 : 0;
  });
  $("#products").html(html);
  // $("#products").masonry({
  //   itemSelector: ".product",
  //   masonry: {
  //     columnWidth: ".product",
  //     // gutter: 10,
  //     transitionDuration: "0.3s"
  //   }
  // });
}

// function setProductWidth() {
//   var width = $(window).width() - 100;
//   var numCols = Math.ceil(width / 400);
//   width -= 40 * (numCols - 1);
//   $(".product").css("width", width / numCols + "px");
// }
//
// setProductWidth();
//
// $(window).resize(function() {
//   setProductWidth();
// });

$("input").on("input", function() {
  console.log("move made");
  console.log(
    $(this)
      .val()
      .toLowerCase()
  );
  console.log(
    $(this)
      .val()
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
  );
  let text = $(this)
    .val()
    .toLowerCase()
    .replace(/[^\w\s]/gi, ""); // remove all non-alphanumeric chars, except space
  if (text == "") {
    console.log("show all");
    $("product").css("display", "block");
  } else {
    let keywords = text.split(" ");
    console.log(keywords);
    $(".product").each(function() {
      let titleText = $(this)
        .find(".title")
        .text()
        .toLowerCase();
      let contains = true;
      for (var keyword of keywords) {
        if (!titleText.includes(keyword)) {
          contains = false;
          break;
        }
      }
      if (contains) {
        $(this).css("display", "block");
      } else {
        $(this).css("display", "none");
      }
    });
  }
});

$("h4").click(function() {
  $("h4").removeClass("buttonPressed");
  $(this).addClass("buttonPressed");
  const index = $(this).index();
  let html = "";
  if (index == 0) {
    // discount
    html = $(".product").sort(function(a, b) {
      var contentA = parseFloat($(a).attr("discount"));
      var contentB = parseFloat($(b).attr("discount"));
      return contentA < contentB ? 1 : contentA > contentB ? -1 : 0;
    });
  } else if (index == 1) {
    // min price
    html = $(".product").sort(function(a, b) {
      var contentA = parseInt($(a).attr("price"));
      var contentB = parseInt($(b).attr("price"));
      return contentA < contentB ? -1 : contentA > contentB ? 1 : 0;
    });
  } else if (index == 2) {
    // index == 2, max price
    html = $(".product").sort(function(a, b) {
      var contentA = parseInt($(a).attr("price"));
      var contentB = parseInt($(b).attr("price"));
      return contentA < contentB ? 1 : contentA > contentB ? -1 : 0;
    });
  }
  $("#products").html(html);
});
