filename = './quantopianOutput.txt'

myReturns = []
spyReturns = []
dates = []

with open(filename) as file:
   for i, line in enumerate(file):
       if not "canceled" in line:
           line = line.rstrip()
           rawDate = line.split(" ")[0].split("-")
           dates.append((int(rawDate[0]), int(rawDate[1]), int(rawDate[2])))
           values = line.split(" ")[-1].split(",")
           print(values)
           myReturn = float(values[0])
           spyReturn = float(values[-1])
           myReturns.append(myReturn)
           spyReturns.append(spyReturn)

myReturns = [(item / myReturns[0] - 1) * 100 for item in myReturns]
spyReturns = [(item / spyReturns[0] - 1) * 100 for item in spyReturns]
dates = ["new Date({},{},{})".format(item[0], item[1], item[2]) for item in dates]

myPoints = ["{{x: {},y: {}}}".format(dates[i], myReturns[i]) for i in range(len(dates))]
spyPoints = ["{{x: {},y: {}}}".format(dates[i], spyReturns[i]) for i in range(len(dates))]

fileContents = "var myPoints = " + str(myPoints) + ";\n" + "var spyPoints = " + str(spyPoints) + ";"

fileContents = "{".join(fileContents.split("'{"))
fileContents = "}".join(fileContents.split("}'"))


print(fileContents)

with open('data.js', 'w') as file:
    file.write(fileContents)
