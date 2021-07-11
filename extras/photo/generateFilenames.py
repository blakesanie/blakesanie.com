import os
import sys

path = sys.path[0]
print(path)
basePath = path.split("extras")[0] + os.path.sep + "public/images/portfolio"

filenames = []

for filename in os.listdir(basePath):
    if filename.split('.')[-1] in ('jpg', 'jpeg'):
        filenames.append(filename)

with open('filenames.js', 'w') as out:
    out.write("module.exports = {};".format(
        filenames))
