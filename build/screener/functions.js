//key is Q89RW8U7CR3LC2AL

var ctx = document.getElementById("myChart").getContext("2d");
var myChart = new Chart(ctx, {
    type: "line",
    data: {
        labels: [],
        datasets: [
            {
                label: "",
                data: [],
                backgroundColor: ["rgba(0,103,255,0.5)"],
                borderColor: ["00FF15"],
                borderWidth: 2,
                pointRadius: 0
            }
        ]
    },
    options: {
        legend: {
            display: false
        },
        tooltips: {
            mode: "index",
            intersect: false,
            displayColors: false,
            backgroundColor: "rgba(0,0,0,0.85)",
            bodyFontSize: 20,
            titleFontSize: 16,
            titleFontStyle: 'normal',
            caretPadding: 0,
            caretSize: 14,
            callbacks: {
                label: function(tooltipItem, data) {
                    return "$" + tooltipItem.yLabel;
                }

            }
        },
        maintainAspectRatio: false,
        scales: {
            yAxes: [
                {
                    gridLines: {
                        display: true,
                        lineWidth: 1,
                        color: "#444444",
                        drawOnChartArea: true,
                        drawTicks: true,
                        drawBorder: false
                    },
                    ticks: {
                        beginAtZero: false,
                        fontSize: 16,
                        callback: function(value, index, values) {
                            return "$" + value;
                        }
                    }
                }
            ],
            xAxes: [
                {
                    gridLines: {
                        display: false
                    },
                    scaleLabel: {},
                    ticks: {
                        autoskip: true,
                        fontSize: 16
                    }
                }
            ]
        }
    }
});

var yVals = [],
    xVals = [];

var mode = "intraday";

var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function callApi() {
    $("p").css("display","block");
    var symbol = $("input").val();
    if (symbol == "") {
        symbol = "^GSPC";
    }
    var timeFunction;
    var interval = "";
    var url;
    if (mode == "intraday") {
        timeFunction = "TIME_SERIES_INTRADAY";
        interval = "&interval=5min";
    }
    if (mode == "daily") {
        timeFunction = "TIME_SERIES_DAILY";
    }
    if (mode == "weekly") {
        timeFunction = "TIME_SERIES_WEEKLY";
    }
    if (mode == "monthly") {
        timeFunction = "TIME_SERIES_MONTHLY";
    }
    url =
        "https://www.alphavantage.co/query?function=" +
        timeFunction +
        "&symbol=" +
        symbol +
        "" +
        interval +
        "&apikey=Q89RW8U7CR3LC2AL";
    console.log(url);
    $.ajax({
        url: url,
        success: function(result) {
            yVals = [];
            xVals = [];
            var data;
            if (mode == "intraday") {
                data = result["Time Series (5min)"];
            }
            if (mode == "daily") {
                data = result["Time Series (Daily)"];
            }
            if (mode == "weekly") {
                data = result["Weekly Time Series"];
            }
            if (mode == "monthly") {
                data = result["Monthly Time Series"];
            }
            var dataObj = Object.keys(data);
            for (var i = 0; i < Math.min(dataObj.length, 100); i++) {
                var title;
                if (mode == "intraday") {
                    title = dataObj[i].split(" ")[1].substring(0, 5);
                    var hour = parseInt(title.substring(0,2));
                    if (hour > 12) {
                        hour -= 12;
                        title = hour + title.substring(2);
                    }
                    while (title.charAt(0) == '0') {
                        title = title.substring(1);
                    }
                } else if (mode == "daily") {
                    title = dataObj[i]
                    var day = title.substring(8);
                    if (day.charAt(0) == '0') {
                        day = day.substring(1);
                    }
                    title = day + " " + months[parseInt(title.substring(5,7)) - 1];
                } else {
                    title = dataObj[i];
                    title = months[parseInt(title.substring(5,7)) - 1] + " '" + dataObj[i].substring(2,4);
                }
                var price = formatPrice(data[dataObj[i]]["1. open"]);
                yVals.unshift(title);
                xVals.unshift(price);
            }
            updateChart();
        }
    });
}

function updateChart() {
    myChart.data.labels = yVals;
    myChart.data.datasets[0].data = xVals;
    $("p").css("display","none");
    myChart.update();
    $("canvas").css("opacity","1");
}

$(document).ready(function() {
    callApi();
});

$("#intraday").click(function() {
    mode = "intraday";
    console.log(mode);
    callApi();
    $("h6 span").css("color","#666");
    $(this).css("color","white");
});

$("#daily").click(function() {
    mode = "daily";
    console.log(mode);
    callApi();
    $("h6 span").css("color","#666");
    $(this).css("color","white");
});

$("#weekly").click(function() {
    mode = "weekly";
    console.log(mode);
    callApi();
    $("h6 span").css("color","#666");
    $(this).css("color","white");
});

$("#monthly").click(function() {
    mode = "monthly";
    console.log(mode);
    callApi();
    $("h6 span").css("color","#666");
    $(this).css("color","white");
});

function formatPrice(str) {
    var out = str;
    out += "00";
    while (out.split(".")[1].length > 2) {
        out = out.substring(0, out.length - 1);
    }
    return out;
}