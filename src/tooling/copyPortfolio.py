from glob import glob
from PIL import Image
import os
import sys
from tqdm import tqdm
import subprocess
import json
from urllib.parse import quote
from multiprocessing import Pool


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

dest = '../assets/images/portfolio'

path = '/Users/blake/Library/Mobile Documents/com~apple~CloudDocs/Images/portfolio'

def processFilepath(filepath):
        img = Image.open(filepath)
        info = img.info
        exif = info['exif']
        filename = filepath.split('/')[-1]
        newFilename = quote(filename).replace('%','--')
        img.thumbnail((2000, 2000),Image.ANTIALIAS)
        newPath = dest + '/' + newFilename
        img.save(newPath, 'JPEG', quality=100, exif=exif)
        # escapedPath = filepath.replace(' ', '\\ ')
        # escapedNew = newPath.replace(' ', '\\  ')
        # os.system(f'exiftool -overwrite_original -TagsFromFile {escapedPath} -all:all>all:all {escapedNew}')
        md = exiftoolFile(filepath)
        # allMeta[newFilename.split('.')[0]] = md
        # out = {}
        # out[newFilename.split('.')[0]] = md
        # out
        return (newFilename.split('.')[0], md)

def copy():

    if os.path.exists(dest):
        dir = os.listdir(dest)
        if len(dir) > 0:
            print('portfolio folder (not empty) already exists')
            sys.exit(0)
    else:
        os.mkdir(dest)

    allMeta = {}

    filepaths = glob(path + '/*')
        
    with Pool(None) as p:
        r = list(tqdm(p.imap(processFilepath, filepaths), total=len(filepaths)))
        for name, md in r:
            # name, md = out
            allMeta[name] = md
                
    with open(dest.replace('portfolio',"metadata.json"), "w") as outfile:
        json.dump(allMeta, outfile)
                
if __name__ == '__main__':
    copy()

# for filepath in tqdm(glob(path + '/*')):
#     img = Image.open(filepath)
#     info = img.info
#     exif = info['exif']
#     filename = filepath.split('/')[-1]
#     newFilename = quote(filename).replace('%','--')
#     img.thumbnail((2000, 2000),Image.ANTIALIAS)
#     newPath = dest + '/' + newFilename
#     img.save(newPath, 'JPEG', quality=100, exif=exif)
#     # escapedPath = filepath.replace(' ', '\\ ')
#     # escapedNew = newPath.replace(' ', '\\  ')
#     # os.system(f'exiftool -overwrite_original -TagsFromFile {escapedPath} -all:all>all:all {escapedNew}')
#     md = exiftoolFile(filepath)
#     allMeta[newFilename.split('.')[0]] = md
    
    
    
    