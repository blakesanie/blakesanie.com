getData();
setInterval(function() {
  getData();
}, 30 * 60 * 1000);

var changes = [];
var interval = 30;

function getData() {
  $.ajax({
    url: "https://financialmodelingprep.com/api/v3/historical-chart/30min/DJI",
    success: function(result) {
      console.log(result);
      for (var i = 1; i < result.length; i++) {
        changes.unshift(
          ((result[i].close - result[i - 1].close) / result[i - 1].close) * 100
        );
      }
      console.log(changes);
      var changeData = {};
      changes = changes.slice(0, 98);
      var mean = average(changes);
      var std = standardDeviation(changes, mean);
      changeData.long = {
        mean: mean * 14,
        std: std
      };
      changes = changes.slice(0, 28);
      mean = average(changes);
      std = standardDeviation(changes, mean);
      changeData.med = {
        mean: mean * 14,
        std: std
      };
      changes = changes.slice(0, 14);
      mean = average(changes);
      std = standardDeviation(changes, mean);
      changeData.short = {
        mean: mean * 14,
        std: std
      };
      console.table(changeData);
      var randomString = getString(changeData);
      $("h1").text(randomString);
    }
  });
}

function getString(data) {
  var minString = "default";
  var minDifference = 0;
  for (var i = 0; i < strings.length; i++) {
    var split = strings[i].split(" ");
    var metaData = split[0].split(",");
    var long = parseFloat(metaData[0]);
    var med = parseFloat(metaData[1]);
    var short = parseFloat(metaData[2]);
    var difference =
      Math.pow(data.long.mean - long, 2) +
      Math.pow(data.med.mean - med, 2) +
      Math.pow(data.short.mean - short, 2);
    if (minDifference == 0 || difference < minDifference) {
      minDifference = difference;
      minString = split.slice(1, split.length).join(" ");
    }
  }
  return minString;
}

function generateChart(result) {
  var points = [];
  for (var i = 0; i < result.length; i++) {
    points.push({
      x: new Date(result[i])
    });
  }
  var chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    axisX: {
      interval: 1,
      valueFormatString: "MMM"
    },
    axisY: {
      includeZero: false,
      prefix: "$",
      title: "Price"
    },
    toolTip: {
      enabled: false
    },
    data: [
      {
        type: "candlestick",
        yValueFormatString: "$##0.00",
        dataPoints: dataPoints
      }
    ]
  });
}

function standardDeviation(values, avg) {
  var squareDiffs = values.map(function(value) {
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });

  var avgSquareDiff = average(squareDiffs);

  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}

function average(data) {
  var sum = data.reduce(function(sum, value) {
    return sum + value;
  }, 0);

  var avg = sum / data.length;
  return avg;
}
