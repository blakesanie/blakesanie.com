startingPeriod = 40;

myPointsToDisplay = myPoints.slice(0, startingPeriod);
spyPointsToDisplay = spyPoints.slice(0, startingPeriod);

var chart = new CanvasJS.Chart("chartHolder", {
  animationEnabled: true,
  axisX: {
    valueFormatString: "YYYY"
  },
  axisY: {
    valueFormatString: "#############",
    suffix: "%",
    gridThickness: 0,
    viewportMinimum: -10
  },
  data: [
    {
      type: "splineArea",
      axisYType: "secondary",
      color: "rgba(54,158,173,.7)",
      markerSize: 2,
      gridThickness: 0,
      dataPoints: myPointsToDisplay
    },
    {
      type: "splineArea",
      axisYType: "secondary",
      color: "rgba(54,158,173,.7)",
      gridThickness: 0,
      markerSize: 2,
      dataPoints: spyPointsToDisplay
    }
  ]
});
chart.render();

var interval;
setTimeout(function() {
  interval = setInterval(addDataToGraph, 0);
}, 1300);

var groupSize = 4;

function addDataToGraph() {
  for (
    var i = 0;
    i < groupSize && myPointsToDisplay.length < myPoints.length;
    i++
  ) {
    currentLength = myPointsToDisplay.length;
    myPointsToDisplay.push(myPoints[currentLength]);
    spyPointsToDisplay.push(spyPoints[currentLength]);
  }
  chart.render();
  if (myPointsToDisplay.length >= myPoints.length) {
    console.log("cancel interval");
    clearInterval(interval);
  }
}

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
