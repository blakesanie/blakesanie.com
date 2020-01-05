var showingCompareData = false;
var showingHistorgramData = false;
var showingNormalData = false;
var showingGreeks = false;
var showingLink = false;

$(document).scroll(handleScroll);

function handleScroll() {
  scrollTop = $(window).scrollTop() + $(window).height();
  if (!showingCompareData && scrollTop > $("#compareChart").offset().top + 20) {
    showingCompareData = true;
    compareChart.render();
  }
  if (!showingHistorgramData && scrollTop > $("#histogram").offset().top + 20) {
    showingHistorgramData = true;
    histogram.render();
  }
  if (!showingNormalData && scrollTop > $("#tTestGraph").offset().top + 20) {
    showingNormalData = true;
    tTest.render();
  }
  if (!showingGreeks && scrollTop > $("#greeks").offset().top + 20) {
    showingGreeks = true;
    $("#greeks").addClass("arisen");
  }
  if (!showingLink && scrollTop > $("#underConstruction").offset().top + 20) {
    showingLink = true;
    $("#underConstruction").addClass("arisen");
  }
}

handleScroll();
// econ: 30975;
/*
$(document).scroll(function() {
  scrollTop = $(window).scrollTop() + $(window).height() - 400;

  if (!showingHistorgramData && scrollTop > $("#histogram").offset().top) {
    showingHistorgramData = true;
    for (
      var i = visibleMyHistogramPoints.length;
      i < myHistogramPoints.length;
      i++
    ) {
      visibleMyHistogramPoints.push(myHistogramPoints[i]);
    }
    histogram.render();
    console.log("now showing");
  } else if (
    showingHistorgramData &&
    scrollTop < $("#histogram").offset().top
  ) {
    showingHistorgramData = false;
    for (var i = visibleMyHistogramPoints.length; i >= 0; i--) {
      visibleMyHistogramPoints.pop();
    }
    histogram.render();
    console.log("now gone");
  }
});
*/
