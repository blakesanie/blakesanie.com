import glob
import os

for filepath in glob.glob(f'./public/images/portfolio/*.jpg', recursive=True):
    fixed = filepath.replace(' ', '_')
    os.rename(filepath, fixed)
