startingPeriod = 360;
animationDuration = 4000;
font = "Dosis";

i = 0;
initialInterval = setInterval(
  showFirstNPercentages,
  animationDuration / startingPeriod
);

function showFirstNPercentages() {
  if (i == startingPeriod) {
    clearInterval(initialInterval);
    return;
  }
  $("tr")
    .eq(0)
    .find("td")
    .eq(1)
    .text(formatNumbers(myPointsToDisplay[i].y) + "%");
  $("tr")
    .eq(1)
    .find("td")
    .eq(1)
    .text(formatNumbers(spyPointsToDisplay[i].y) + "%");
  i++;
}

// minY = 0;
// maxY = 0;

myPointsToDisplay = myPoints.slice(0, startingPeriod);
spyPointsToDisplay = spyPoints.slice(0, startingPeriod);

var chart = new CanvasJS.Chart("myChart", {
  animationEnabled: true,
  animationDuration: animationDuration,
  backgroundColor: "transparent",
  toolTip: {
    enabled: false,
    shared: true,
    borderColor: "transparent",
    fontFamily: font,
    backgroundColor: "white",
    cornerRadius: 10,
    contentFormatter: function(e) {
      console.log(e);
      var content = "<div id='myToolTip'>";
      datasets = ["Sanie", "S&P 500"];
      console.log(e.entries[0].dataPoint.x);
      var date = new Date(e.entries[0].dataPoint.x);
      content +=
        "<p id='pointDate'>" +
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
    }
  },
  axisX: {
    valueFormatString: "YYYY",
    labelFontSize: 12,
    labelFontColor: "white",
    labelFontFamily: font,
    lineThickness: 0,
    tickThickness: 0
  },
  axisY2: {
    gridThickness: 0,
    minimum: -30,
    labelFontSize: 12,
    labelFontColor: "white",
    labelFontFamily: font,
    lineThickness: 0,
    tickThickness: 0,
    margin: 0,
    valueFormatString: "###,###,##0",
    suffix: "%"
    // interval: 10000
  },
  data: [
    {
      type: "splineArea",
      // mousemove: chartHovered,
      axisYType: "secondary",
      color: "#ffffff30",
      lineColor: "white",
      markerSize: 0,
      dataPoints: myPointsToDisplay
    },
    {
      type: "splineArea",
      axisYType: "secondary",
      color: "black",
      lineColor: "white",
      markerSize: 0,
      dataPoints: spyPointsToDisplay
    }
  ]
});
chart.render();

var interval;
setTimeout(function() {
  interval = setInterval(addDataToGraph, 0);
}, animationDuration);

var groupSize = 3;

function addDataToGraph() {
  for (
    var i = 0;
    i < groupSize && myPointsToDisplay.length < myPoints.length;
    i++
  ) {
    var currentLength = myPointsToDisplay.length;
    var newMy = myPoints[currentLength];
    var newSpy = spyPoints[currentLength];
    myPointsToDisplay.push(newMy);
    spyPointsToDisplay.push(newSpy);
    $("tr")
      .eq(0)
      .find("td")
      .eq(1)
      .text(formatNumbers(newMy.y) + "%");
    $("tr")
      .eq(1)
      .find("td")
      .eq(1)
      .text(formatNumbers(newSpy.y) + "%");
    // minY = Math.min(newSpy.y, Math.min(newMy.y, minY));
    // maxY = Math.max(newSpy.y, Math.max(newMy.y, maxY));
  }

  // moveMarkers();
  console.log($(window).scrollTop());
  if (
    myPointsToDisplay.length == myPoints.length ||
    $(window).scrollTop() < $(window).height()
  ) {
    chart.render();
    if (myPointsToDisplay.length == myPoints.length) {
      $(".action").addClass("appearRise");
      console.log("cancel interval");
      clearInterval(interval);
    }
  }
}

function formatNumbers(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

$(".info").click(function() {
  overlay = $(this).siblings(".greekOverlay");
  if (overlay.css("opacity") < 1) {
    overlay.css({
      opacity: 1,
      "pointer-events": "all"
    });
  } else if (overlay.css("opacity") > 0) {
    overlay.css({
      opacity: 0,
      "pointer-events": "none"
    });
    $(this).css({
      "background-color": "white",
      color: "black",
      "border-color": "rgba(0, 0, 0, 0.2)"
    });
  }
});

$(".action").click(function() {
  $("html").animate(
    {
      scrollTop: $("h3")
        .eq(0)
        .offset().top
    },
    500
  );
});

// $(".info").hover(
//   function() {
//     $(this)
//       .siblings(".greekOverlay")
//       .css("opacity", 1);
//   },
//   function() {
//     $(this)
//       .siblings(".greekOverlay")
//       .css("opacity", 0);
//   }
// );

// setTimeout(function() {
//   $(".action").addClass("appearRise");
// }, 10000);

// function chartHovered(e) {
//   x = e.dataPointIndex;
//   myY = e.dataPoint.y;
//   spyY = spyPoints[x].y;
//   // console.log(myY, spyY);
//   console.log(e);
//   $("#hoverHelper").css({
//     display: "block",
//     transform: "translate(" + e.x + "px," + e.y + "px)"
//   });
// }

// function moveMarkers() {
//   var range = maxY - minY;
//   var currentMyY = myPointsToDisplay[myPointsToDisplay.length - 1].y;
//   var currentSpyY = spyPointsToDisplay[spyPointsToDisplay.length - 1].y;
//   var myTranslation = (currentMyY / range) * 10000;
//   var spyTranslation = (currentSpyY / range) * 10000;
//   $("#myPercent").css("transform", "translateY(-" + myTranslation + "%)");
//   $("#spyPercent").css("transform", "translateY(-" + spyTranslation + "%)");
// }

//{ x: 50, y: 85, indexLabel: "high", markerType: "triangle",markerColor: "red", markerSize: 12 }

// function addDataToGraph() {
//   if (myPointsToDisplay.length < myPoints.length) {
//     currentLength = myPointsToDisplay.length;
//     newLength = Math.min(currentLength + groupSize, myPoints.length);
//     myPointsToDisplay.push(myPoints.slice(currentLength, newLength));
//     spyPointsToDisplay.push(spyPoints.slice(currentLength, newLength));
//     chart.render();
//   } else {
//     console.log("cancel interval");
//     clearInterval(interval);
//   }
// }
