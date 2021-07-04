$(".info").click(function () {
  overlay = $(this).siblings(".greekOverlay");
  if (overlay.css("opacity") < 1) {
    overlay.css({
      opacity: 1,
      "pointer-events": "all",
    });
  } else if (overlay.css("opacity") > 0) {
    overlay.css({
      opacity: 0,
      "pointer-events": "none",
    });
    $(this).css({
      "background-color": "white",
      color: "black",
      "border-color": "rgba(0, 0, 0, 0.2)",
    });
  }
});

$(".action").click(function () {
  $("html").animate(
    {
      scrollTop: $("h3").eq(0).offset().top - 50,
    },
    500
  );
});

var histogramStep = myHistogramPoints[1].x - myHistogramPoints[0].x;

function removeBeforeDecimal(num) {
  num = "" + num;
  if (num.substring(0, 2) == "0.") {
    return num.substring(1);
  }
  if (num.substring(0, 3) == "-0.") {
    return "-" + num.substring(2);
  }
  return num;
}

var compareChart = new CanvasJS.Chart("compareChart", {
  animationEnabled: true,
  animationDuration: 2000,
  zoomEnabled: true,
  backgroundColor: "transparent",
  toolTip: {
    enabled: true,
    shared: true,
    borderColor: "transparent",
    fontFamily: font,
    backgroundColor: "white",
    cornerRadius: 10,
    contentFormatter: function (e) {
      var content = "<div id='myToolTip'>";
      datasets = ["Sanie", "S&P 500"];
      var date = new Date(e.entries[0].dataPoint.x);
      content +=
        "<p id='toolTipHeader'>" +
        (date.getMonth() + 1) +
        "/" +
        date.getDate() +
        "/" +
        date.getFullYear() +
        "</p><table id='pointTable' cellspacing='0'>";
      for (var i = 0; i < e.entries.length; i++) {
        content +=
          "<tr><td>" +
          datasets[i] +
          "</td><td>" +
          e.entries[i].dataPoint.y +
          "%</td></tr>";
      }
      return content + "</table></div>";
    },
  },
  axisX: {
    valueFormatString: "MM/YYYY",
    labelFontSize: 12,
    labelFontColor: "#00000080",
    labelFontFamily: font,
    lineThickness: 0,
    tickThickness: 0,
  },
  axisY2: {
    gridThickness: 0,
    minimum: -30,
    labelFontSize: 12,
    labelFontColor: "#00000080",
    labelFontFamily: font,
    lineThickness: 0,
    tickThickness: 0,
    margin: 0,
    valueFormatString: "###,###,##0",
    suffix: "%",
    // interval: 10000
  },
  data: [
    {
      type: "splineArea",
      // mousemove: chartHovered,
      axisYType: "secondary",
      color: "#54e4a630",
      lineColor: "#54e4a6",
      markerSize: 0,
      dataPoints: myPoints,
    },
    {
      type: "splineArea",
      axisYType: "secondary",
      color: "#9198e530",
      lineColor: "#9198e5",
      markerSize: 0,
      dataPoints: spyPoints,
    },
  ],
});

var histogram = new CanvasJS.Chart("histogram", {
  animationEnabled: true,
  animationDuration: 2000,
  backgroundColor: "transparent",
  toolTip: {
    enabled: true,
    shared: true,
    borderColor: "transparent",
    fontFamily: font,
    backgroundColor: "white",
    cornerRadius: 10,
    contentFormatter: function (e) {
      var content = "<div id='myToolTip'>";
      datasets = ["Sanie", "S&P 500"];
      lower = e.entries[0].dataPoint.x;
      upper = lower + histogramStep;
      content +=
        "<p id='toolTipHeader'>" +
        removeBeforeDecimal(lower) +
        "% to " +
        removeBeforeDecimal(upper) +
        "%</p><table id='pointTable' cellspacing='0'>";
      for (var i = 0; i < 2; i++) {
        factor = i == 1 ? -1 : 1;
        content +=
          "<tr><td>" +
          datasets[i] +
          "</td><td>" +
          factor * parseFloat(e.entries[i].dataPoint.y) +
          "% of weeks</td></tr>";
      }
      return content + "</table></div>";
    },
  },
  axisX: {
    valueFormatString: "#####0",
    suffix: "%",
    labelFontSize: 14,
    labelFontColor: "#00000080",
    labelFontFamily: font,
    lineThickness: 0,
    tickThickness: 0,
    // interval: 2
  },
  axisY: {
    gridThickness: 0,
    labelFontSize: 0,
    lineThickness: 0,
    tickThickness: 0,
    valueFormatString: "",
    minimum: -18,
    maximum: 13,
  },
  data: [
    {
      type: "stackedColumn",
      color: "#54e4a6",
      markerSize: 0,
      dataPoints: myHistogramPoints,
      lineThickness: 0,
    },
    {
      type: "stackedColumn",
      color: "#9198e5",
      markerSize: 0,
      dataPoints: spyHistogramPoints,
    },
    {
      type: "splineArea",
      lineColor: "#54e4a6",
      color: "#54e4a630",
      markerSize: 0,
      dataPoints: myNormalPoints,
      indexLabelFontSize: 20,
      indexLabelFontFamily: font,
      indexLabelPlacement: "outside",
    },
    {
      type: "splineArea",
      lineColor: "#9198e5",
      color: "#9198e530",
      markerSize: 0,
      dataPoints: spyNormalPoints,
      indexLabelFontSize: 20,
      indexLabelFontFamily: font,
      indexLabelPlacement: "outside",
    },
  ],
});

var tTest = new CanvasJS.Chart("tTestGraph", {
  animationEnabled: true,
  animationDuration: 2000,
  backgroundColor: "transparent",
  toolTip: {
    enabled: false,
  },
  axisX: {
    valueFormatString: "#####0.##",
    suffix: "%",
    labelFontSize: 0,
    labelFontColor: "#00000080",
    labelFontFamily: font,
    lineThickness: 0,
    tickThickness: 0,
  },
  axisY: {
    gridThickness: 0,
    labelFontSize: 0,
    lineThickness: 0,
    tickThickness: 0,
    valueFormatString: "",
    minimum: 0,
    maximum: 0.42,
  },
  data: [
    {
      type: "splineArea",
      lineColor: "#9198e5",
      color: "#9198e540",
      markerSize: 0,
      dataPoints: insignificantPoints,
      indexLabelFontSize: 20,
      indexLabelFontFamily: font,
    },
    {
      type: "splineArea",
      lineColor: "black",
      color: "#54e4a6a0",
      markerSize: 0,
      dataPoints: significantPoints,
      indexLabelFontSize: 20,
      indexLabelFontFamily: font,
    },
  ],
});
