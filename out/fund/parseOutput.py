import csv
import numpy as np
from scipy.stats import norm, ttest_ind
import math

filename = './quantopianOutput2.txt'

myTotalReturns = []
spyTotalReturns = []
dates = []

with open(filename) as file:
   for i, line in enumerate(file):
       if not "canceled" in line:
           line = line.rstrip()
           rawDate = line.split(" ")[0].split("-")
           dates.append((int(rawDate[0]), int(rawDate[1]), int(rawDate[2])))
           values = line.split(" ")[-1].split(",")
           myReturn = float(values[0])
           spyReturn = float(values[-1])
           myTotalReturns.append(myReturn)
           spyTotalReturns.append(spyReturn)

dates = ["new Date({},{},{})".format(item[0], item[1], item[2]) for item in dates]
myReturns = [round((item / myTotalReturns[0] - 1) * 100, 1) for item in myTotalReturns]
spyReturns = [round((item / spyTotalReturns[0] - 1) * 100, 1) for item in spyTotalReturns]

myPoints = ["{{x: {},y: {}}}".format(dates[i], myReturns[i]) for i in range(len(dates))]
spyPoints = ["{{x: {},y: {}}}".format(dates[i], spyReturns[i]) for i in range(len(dates))]

fileContents = "var myPoints = " + str(myPoints) + ";\n" + "var spyPoints = " + str(spyPoints) + ";\n"

# statistics

myWeeklyReturns = []
spyWeeklyReturns = []

for i in range(1, len(myReturns)):
    try:
        myWeeklyReturns.append((myTotalReturns[i] - myTotalReturns[i-1]) / myTotalReturns[i-1])
    except Exception as e:
        print(e, i)
    try:
        spyWeeklyReturns.append((spyTotalReturns[i] - spyTotalReturns[i-1]) / spyTotalReturns[i-1])
    except Exception as e:
        print(e, i)

myMean = np.mean(myWeeklyReturns)
myStd = np.std(myWeeklyReturns)

spyMean = np.mean(spyWeeklyReturns)
spyStd = np.std(spyWeeklyReturns)

graphRange = (-0.15,0.16)
numBins = 62

myHistogram = np.histogram(a= myWeeklyReturns, bins = numBins, range=graphRange, density = False)
spyHistogram = np.histogram(a= spyWeeklyReturns, bins = numBins, range=graphRange, density = False)

# myHistogramPoints = ["{{x: {},y: {}}}".format("{} - {}%".format(int(round(myHistogram[1][i] * 100)), int(round(myHistogram[1][i] * 100)) + 1), spyHistogram[0][i]) for i in range(len(myHistogram[0]))]

myHistogramPoints = ["{{x: {},y: {}}}".format(round(myHistogram[1][i] * 100, 1), round(myHistogram[0][i] / len(myWeeklyReturns) * 100, 2)) for i in range(len(myHistogram[0]))]
spyHistogramPoints = ["{{x: {},y: {}}}".format(round(spyHistogram[1][i] * 100, 1), -round(spyHistogram[0][i] / len(spyWeeklyReturns) * 100,2)) for i in range(len(spyHistogram[0]))]

print(len(myHistogramPoints))

normalStart = graphRange[0] * 100
normalEnd = graphRange[1] * 100
normalInterval = 0.5
normalScale = len(myWeeklyReturns) * 0.095
myNormalPoints = norm.pdf(np.arange(normalStart, normalEnd, normalInterval),myMean * 100,myStd * 100)
myNormalPointsFormatted = []
meanAdded = False
for i, y in enumerate(myNormalPoints):
    x = normalStart + i * normalInterval
    if x > myMean * 100 and not meanAdded:
        myNormalPointsFormatted.append("{{x: {},y: {}, indexLabel: \"μ = {}%, σ = {}%\",  markerColor: \"black\", markerSize: 8}}".format(myMean * 100, norm.pdf(myMean * 100,myMean * 100,myStd * 100) * normalScale, round(myMean * 100,2), round(myStd * 100,2)))
        meanAdded = True
    x = round(x, 2)
    myNormalPointsFormatted.append("{{x: {},y: {}}}".format(x, y * normalScale))

# myNormalPointsFormatted = ["{{x: {},y: {}}}".format(round(normalStart + i * normalInterval, 2), myNormalPointsFormatted[i]) for i in range(len(myNormalPointsFormatted))]

# myNormalPointsFormatted.append("{{x: {},y: {}}}".format(myMean * 100, norm.pdf(myMean * 100,myMean * 100,myStd * 100)))
spyNormalPoints = norm.pdf(np.arange(normalStart, normalEnd, normalInterval),spyMean * 100,spyStd * 100)

spyNormalPointsFormatted = []
meanAdded = False
for i, y in enumerate(spyNormalPoints):
    x = normalStart + i * normalInterval
    if x > spyMean * 100 and not meanAdded:
        spyNormalPointsFormatted.append("{{x: {},y: {}, indexLabel: \"μ = {}%, σ = {}%\",  markerColor: \"black\", markerSize: 8}}".format(spyMean * 100, -norm.pdf(spyMean * 100,spyMean * 100,spyStd * 100) * normalScale , round(spyMean * 100,2), round(spyStd * 100,2)))
        meanAdded = True
    x = round(x, 2)
    spyNormalPointsFormatted.append("{{x: {},y: {}}}".format(x, -y * normalScale))
# spyNormalPointsFormatted = ["{{x: {},y: {}}}".format(round(normalStart + i * normalInterval, 2), spyNormalPointsFormatted[i]) for i in range(len(spyNormalPointsFormatted))]
meanDiff = (myMean - spyMean) * 100
stdError = math.sqrt(myStd * myStd * 10000 + spyStd * spyStd * 10000)
t, p = ttest_ind(myWeeklyReturns, spyWeeklyReturns, equal_var=False)
print(t,p)
# raise Exception("stop")
tY = norm.pdf(t,0,1)
yOffset = 0.02
tTestX = np.arange(-3, 6.2, 0.3)
tTestY = norm.pdf(tTestX,0,1)
insignificantPoints = []
significantPoints = ["{{x: {},y: {}, indexLabel: \"t = {}, p = {}\",  markerColor: \"black\", markerSize: 8}}".format(t, tY + yOffset, round(t,2), round(p, 4))]
for i in range(len(tTestX)):
    x = round(tTestX[i],2)
    y = tTestY[i]
    point = "{{x: {},y: {}}}".format(x, y + yOffset)
    if x < t:
        insignificantPoints.append(point)
    else:
        significantPoints.append(point)
insignificantPoints.append("{{x: {},y: {}, }}".format(t, tY + yOffset))




fileContents += "var myNormalPoints = " + str(myNormalPointsFormatted) + ";\n" + "var spyNormalPoints = " + str(spyNormalPointsFormatted) + "; var myHistogramPoints = " + str(myHistogramPoints) + ";\n" + "var spyHistogramPoints = " + str(spyHistogramPoints) + ";\n var insignificantPoints = " + str(insignificantPoints) + ";\n var significantPoints = " + str(significantPoints) + ";"

fileContents = "{".join(fileContents.split("'{"))
fileContents = "}".join(fileContents.split("}'"))

with open('data.js', 'w') as file:
    file.write(fileContents)

with open('data.csv', mode='w') as file:
    writer = csv.writer(file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
    writer.writerow(["S&P 500 Returns", "My Returns"])
    for i in range(len(myWeeklyReturns)):
        writer.writerow([spyWeeklyReturns[i], myWeeklyReturns[i]])
