from glob import glob
from PIL import Image
import os
import sys
from tqdm import tqdm
import subprocess
import json

dest = '../../assets/images/portfolio'


if os.path.exists(dest):
    dir = os.listdir(dest)
    if len(dir) > 0:
        print('portfolio folder (not empty) already exists')
        sys.exit(0)
else:
    os.mkdir(dest)



def exiftoolFile(filepath):
    meta = subprocess.check_output([f'exiftool', filepath]).decode('utf-8')
    md = {}
    meta.split('\n')
    for line in meta.split('\n'):
        parts = line.split(' : ')
        k = parts[0].strip()
        v = ' : '.join(parts[1:]).strip()
        md[k] = v
    return md



path = '/Users/blake/Library/Mobile Documents/com~apple~CloudDocs/Images/portfolio'

allMeta = {}

for filepath in tqdm(glob(path + '/*')):
    img = Image.open(filepath)
    info = img.info
    exif = info['exif']
    filename = filepath.split('/')[-1]
    img.thumbnail((2000, 2000),Image.ANTIALIAS)
    newPath = dest + '/' + filename
    img.save(newPath, 'JPEG', quality=100, exif=exif)
    escapedPath = filepath.replace(' ', '\\ ')
    escapedNew = newPath.replace(' ', '\\  ')
    # os.system(f'exiftool -overwrite_original -TagsFromFile {escapedPath} -all:all>all:all {escapedNew}')
    md = exiftoolFile(filepath)
    allMeta[filename.split('.')[0]] = md
    
with open("metadata.json", "w") as outfile:
    json.dump(allMeta, outfile)
    
    