from collections import defaultdict
from PIL.ExifTags import TAGS, GPSTAGS
from PIL import Image
import os
import sys

path = sys.path[0]
print(path)
basePath = path.split("extras")[0] + os.path.sep + "public/images/portfolio"


def get_exif(filename):
    image = Image.open(filename)
    exif = image._getexif()
    processed = {}
    final = defaultdict(dict)
    if exif is not None:
        for key, value in exif.items():
            name = TAGS.get(key, key)
            processed[name] = value

        if 'GPSInfo' in processed:

            for key, value in processed['GPSInfo'].items():
                name = GPSTAGS.get(key, key)
                final['GPSInfo'][name] = value

    return final, image.width, image.height


def get_decimal_coordinates(info):
    for key in ['Latitude', 'Longitude']:
        if 'GPS'+key in info and 'GPS'+key+'Ref' in info:
            e = info['GPS'+key]
            ref = info['GPS'+key+'Ref']
            info[key] = (e[0][0]/e[0][1] +
                         e[1][0]/e[1][1] / 60 +
                         e[2][0]/e[2][1] / 3600
                         ) * (-1 if ref in ['S', 'W'] else 1)

    if 'Latitude' in info and 'Longitude' in info:
        return [info['Latitude'], info['Longitude']]


filenames = {}

for filename in os.listdir(basePath):
    if filename.split('.')[-1] in ('jpg', 'jpeg'):
        exif, width, height = get_exif(basePath + os.path.sep + filename)
        coords = get_decimal_coordinates(
            exif['GPSInfo']) or []

        filenames[filename] = {'gps': coords, 'width': width, 'height': height}

with open('filenames.js', 'w') as out:
    out.write("module.exports = {};".format(
        filenames))
