$("canvas").click(function(e) {
  var posX = $(this).position().left,
    posY = $(this).position().top;
  var xPercent = (e.pageX - posX) / $(this).width();
  var yPercent = (e.pageY - posY) / $(this).height();
  console.log(xPercent, yPercent);
});
