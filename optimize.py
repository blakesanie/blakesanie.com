import json
import glob
import os
from PIL import Image
import math
import shutil
import sys
import numpy as np
import multiprocessing

numWorkers = 10

widths = []

with open('./next.config.js') as file:
    contents = file.read()
    keys = ['deviceSizes:', 'imageSizes:']
    temp = {}
    for key in keys:
        contents = contents[contents.index(key) + len(key):]
        widths.extend(json.loads(contents[:contents.index(']') + 1]))

widths = sorted(list(set(widths)))
qualities = [75]

startingDir = 'public/images'
# if len(sys.argv) > 1:
#     startingDir += os.path.sep + sys.argv[1]
extensions = ['jpeg', 'jpg', 'png']


if not 'keepexisting' in ', '.join(sys.argv):
    print('deleting existing images in /optimized/')
    try:
        shutil.rmtree('public/optimized')
    except Exception as e:
        print(e)

filepaths = []
for ext in extensions:
    filepaths.extend(glob.glob(f'{startingDir}/**/*.{ext}', recursive=True))


def optimizeImages(paths):
    for filepath in paths:
        img = Image.open(filepath)
        originalWidth, originalHeight = img.size
        filename = os.path.split(filepath)[-1]
        originalExt = filename.split('.')[-1]
        if originalExt != 'png':
            img = img.convert('RGB')
        for width in widths:
            if originalWidth < 700 and width > 700:
                break
            if originalWidth > 1000 and width < 400:
                continue
            for quality in qualities:
                newImg = img.resize(
                    (width, math.floor(width / originalWidth * originalHeight)), Image.ANTIALIAS)
                for ext in [originalExt]:  # will need serverless for webp
                    filepathParts = filepath.split(os.path.sep)
                    filepathParts.insert(1, 'optimized')
                    newFilename = '.'.join(filepathParts[-1].split('.')[0:-1])
                    newFilename += f'_w={width}&q={quality}.{ext}'
                    filepathParts[-1] = newFilename
                    newFilepath = os.path.join(*filepathParts)
                    if ext.lower() == 'jpg':
                        ext = 'jpeg'

                    parentDir = os.path.join(*filepathParts[:-1])
                    if not os.path.isdir(parentDir):
                        os.makedirs(parentDir, exist_ok=True)

                    pngInfo = img.info

                    newImg.save(newFilepath, ext, quality=quality,
                                subsampling=0, optimize=True, **pngInfo)
                    print(newFilepath)


chunks = np.array_split(filepaths, numWorkers)
# print(filepaths)
# print(chunks)

processes = []

if __name__ == '__main__':
    for i in range(numWorkers):
        processes.append(multiprocessing.Process(
            target=optimizeImages, args=(chunks[i],)))

    for i in range(numWorkers):
        processes[i].start()

    for i in range(numWorkers):
        processes[i].join()
