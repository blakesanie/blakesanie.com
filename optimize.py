import json
import glob
import os
from PIL import Image
import math
import shutil

widths = []

with open('./next.config.js') as file:
    contents = file.read()
    keys = ['deviceSizes:', 'imageSizes:']
    temp = {}
    for key in keys:
        contents = contents[contents.index(key) + len(key):]
        widths.extend(json.loads(contents[:contents.index(']') + 1]))

widths = sorted(list(set(widths)))
qualities = [60, 75, 90, 100]

startingDir = 'public'
extensions = ['jpg', 'jpeg', 'png']

filepaths = []
for ext in extensions:
    filepaths.extend(glob.glob(f'{startingDir}/**/*.{ext}', recursive=True))

shutil.rmtree('public/optimized')

for filepath in filepaths:
    img = Image.open(filepath)
    originalWidth, originalHeight = img.size
    filename = os.path.split(filepath)[-1]
    originalExt = filename.split('.')[-1]
    print(filename)
    for width in widths:
        if width > originalWidth:
            break
        for quality in qualities:
            img = img.resize(
                (width, math.floor(width / originalWidth * originalHeight)), Image.ANTIALIAS)
            img = img.convert('RGB')
            for ext in [originalExt, 'webp']:
                filepathParts = filepath.split(os.path.sep)
                filepathParts.insert(1, 'optimized')
                newFilename = '.'.join(filepathParts[-1].split('.')[0:-1])
                newFilename += f'?w={width}&q={quality}.{ext}'
                filepathParts[-1] = newFilename
                newFilepath = os.path.join(*filepathParts)
                if ext.lower() == 'jpg':
                    ext = 'jpeg'

                parentDir = os.path.join(*filepathParts[:-1])
                if not os.path.isdir(parentDir):
                    os.makedirs(parentDir, exist_ok=True)

                img.save(newFilepath, ext, quality=quality,
                         subsampling=0, optimize=True)
                print(newFilepath)
