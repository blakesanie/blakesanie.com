import os
from PIL import Image

basePath = "../images/full"

filenames = []
landscapeFilenames = []
portraitFilenames = []

for filename in os.listdir(basePath):
    if filename.endswith(".jpg"):
        filenames.append(filename)
        image = Image.open("{}/{}".format(basePath, filename))
        width, height = image.size
        aspectRatio = width / height
        if 2 > aspectRatio > 1:
            landscapeFilenames.append(filename)
        if aspectRatio < 1.2:
            portraitFilenames.append(filename)

with open('filenames.js', 'w') as out:
  out.write("var filenames = {}; var portraitFilenames = {}; var landscapeFilenames = {};".format(filenames, portraitFilenames, landscapeFilenames))
