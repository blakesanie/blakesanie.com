import json
import glob
import os
from PIL import Image
import math
import shutil
import sys
import numpy as np
import multiprocessing
from tqdm import tqdm


numWorkers = 20

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


def optimizeImage(filepath):
    img = Image.open(filepath)
    originalWidth, originalHeight = img.size
    filename = os.path.split(filepath)[-1]
    originalExt = filename.split('.')[-1]
    if originalExt != 'png':
        img = img.convert('RGB')
    for width in widths:
        # if originalWidth < 700 and width > 700:
        #     break
        # if originalWidth > 1000 and width < 400:
        #     continue
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


if __name__ == '__main__':
    # python {optional starting dir} --keepexisting
    filepaths = []
    if len(sys.argv) > 1 and not sys.argv[1].startswith('--'):
        startingDir = os.path.join(startingDir, sys.argv[1])
        if os.path.isfile(startingDir):
            filepaths.append(startingDir)

    if not 'keepexisting' in ', '.join(sys.argv):
        print('deleting existing images in /optimized/')
        try:
            shutil.rmtree('public/optimized')
        except Exception as e:
            print(e)

    for ext in extensions:
        filepaths.extend(
            glob.glob(f'{startingDir}/**/*.{ext}', recursive=True))
    print(filepaths)
    print(sys.argv)
    # raise Exception()

    with multiprocessing.Pool(numWorkers) as p:
        for _ in tqdm(p.imap_unordered(optimizeImage, filepaths), total=len(filepaths)):
            pass
