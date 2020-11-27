import os
import sys
from PIL import Image

path = sys.path[0]
basePath = path.split("src")[0] + "/public/images/full"

filenames = []
landscapeFilenames = []
portraitFilenames = []

for filename in os.listdir(basePath):
    if filename.endswith(".jpeg"):
        filenames.append(filename)
        image = Image.open("{}/{}".format(basePath, filename))
        width, height = image.size
        aspectRatio = width / height
        if 2 > aspectRatio > 1:
            landscapeFilenames.append(filename)
        if aspectRatio < 1.2:
            portraitFilenames.append(filename)

with open('filenames.js', 'w') as out:
    out.write("module.exports = {}; module.exports.portraitFilenames = {}; module.exports.landscapeFilenames = {};".format(
        filenames, portraitFilenames, landscapeFilenames))
