from collections import defaultdict
from PIL.ExifTags import TAGS, GPSTAGS
from PIL import Image
import os
import sys
from pprint import pprint
from sklearn.cluster import KMeans
import numpy as np
from matplotlib.colors import rgb2hex

path = sys.path[0]
print(path)
basePath = path.split("extras")[0] + os.path.sep + "public/images/portfolio"


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


def get_exif(filename):
    image = Image.open(filename)
    exif = image._getexif()
    processed = {}
    final = defaultdict(dict)
    final['exif'] = {}
    if exif is not None:
        for key, value in exif.items():
            name = TAGS.get(key, key)
            processed[name] = value

        pprint(processed)

        if 'FocalLengthIn35mmFilm' in processed:
            final['exif']['focalLength'] = f'{processed["FocalLengthIn35mmFilm"]}mm'
        if 'ExposureTime' in processed:
            numerator, denominator = processed["ExposureTime"]
            final['exif']['shutterSpeed'] = f"{numerator}/{denominator} s" if denominator > numerator else f"{numerator} s"
            if len(final['exif']['shutterSpeed']) > 8:
                base = '{:.1e}'.format(
                    numerator/denominator)
                split = base.split('e')
                final['exif']['shutterSpeed'] = split[0].replace(".0", "") + \
                    "E" + str(int(split[1])) + " s"
        if 'FNumber' in processed:
            numerator, denominator = processed["FNumber"]
            final['exif']['aperture'] = f"F{numerator / denominator}".replace(
                ".0", "")
        if 'ISOSpeedRatings' in processed:
            # print('FOUND ISO')
            final['exif']['iso'] = f'ISO {processed["ISOSpeedRatings"]}'
        if 'GPSInfo' in processed:
            tmp = {}
            for key, value in processed['GPSInfo'].items():
                name = GPSTAGS.get(key, key)
                tmp[name] = value
            final['exif']['gps'] = get_decimal_coordinates(
                tmp)

        # get background color
        sampleWidth = 16
        img = np.asarray(image.resize(
            (sampleWidth, int(image.size[1]/image.size[0]*sampleWidth))))
        colors = img.reshape((img.shape[1]*img.shape[0], 3))

        kmeans = KMeans(n_clusters=4)
        kmeans.fit(colors)

        centroid = kmeans.cluster_centers_
        labels = list(kmeans.labels_)
        percentages = np.zeros(len(centroid))

        for i in range(len(centroid)):
            percentages[i] = labels.count(i) / len(labels)

        mostCommon = centroid[np.argmax(percentages)]
        hex = rgb2hex(mostCommon / 255)
        final['color'] = hex

    return final, image.width, image.height


filenames = {}

for filename in os.listdir(basePath):
    if filename.split('.')[-1] in ('jpg', 'jpeg'):
        exif, width, height = get_exif(basePath + os.path.sep + filename)

        filenames[filename] = {'width': width, 'height': height, **exif}

with open('filenames.js', 'w') as out:
    out.write("module.exports = {};".format(
        filenames))
