startingPeriod = 360;
animationDuration = 4000;
font = "abel";

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
    enabled: false
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
  chart.render();
  if (myPointsToDisplay.length >= myPoints.length) {
    $(".action").addClass("appearRise");
    console.log("cancel interval");
    clearInterval(interval);
  }
}

function formatNumbers(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

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
