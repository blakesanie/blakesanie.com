startingPeriod = 60;

myPointsToDisplay = myPoints.slice(0, startingPeriod);
spyPointsToDisplay = spyPoints.slice(0, startingPeriod);

var chart = new CanvasJS.Chart("chartHolder", {
  animationEnabled: true,
  axisX: {
    valueFormatString: "YYYY",
    labelFontSize: 12,
    lineThickness: 0,
    tickThickness: 0
  },
  axisY2: {
    valueFormatString: "#############0",
    suffix: "%",
    gridThickness: 0,
    minimum: -15,
    labelFontSize: 12,
    lineThickness: 0,
    tickThickness: 0
  },
  data: [
    {
      type: "splineArea",
      axisYType: "secondary",
      color: "rgba(54,158,173,.7)",
      markerSize: 2,
      dataPoints: myPointsToDisplay
    },
    {
      type: "splineArea",
      axisYType: "secondary",
      color: "rgba(54,158,173,.7)",
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
  var currentLength = myPointsToDisplay.length;

  prevX = myPointsToDisplay[currentLength - 1].x;
  prevMyY = myPointsToDisplay[currentLength - 1].y;
  prevSpyY = spyPointsToDisplay[currentLength - 1].y;

  myPointsToDisplay.pop();
  myPointsToDisplay.push({
    x: prevX,
    y: prevMyY
  });

  spyPointsToDisplay.pop();
  spyPointsToDisplay.push({
    x: prevX,
    y: prevSpyY
  });

  for (
    var i = 0;
    i < groupSize && myPointsToDisplay.length < myPoints.length;
    i++
  ) {
    currentLength = myPointsToDisplay.length;

    myPointsToDisplay.push(myPoints[currentLength]);
    spyPointsToDisplay.push(spyPoints[currentLength]);
  }

  prevX = myPointsToDisplay[currentLength - 1].x;
  prevMyY = myPointsToDisplay[currentLength - 1].y;
  prevSpyY = spyPointsToDisplay[currentLength - 1].y;

  myPointsToDisplay.pop();
  myPointsToDisplay.push({
    x: prevX,
    y: prevMyY,
    indexLabel: "Blake Sanie",
    indexLabelMaxWidth: 10,
    //markerType: "triangle",
    markerColor: "red",
    markerSize: 12
  });

  spyPointsToDisplay.pop();
  spyPointsToDisplay.push({
    x: prevX,
    y: prevSpyY,
    indexLabel: "S&P 500",
    //markerType: "triangle",
    markerColor: "red",
    markerSize: 12
  });

  chart.render();
  if (myPointsToDisplay.length >= myPoints.length) {
    console.log("cancel interval");
    clearInterval(interval);
  }
}

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
