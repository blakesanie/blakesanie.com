from glob import glob
from tqdm import tqdm


path = '/Users/blake/Library/Mobile Documents/com~apple~CloudDocs/Images/portfolio'


for filepath in tqdm(glob(path + '/*')):
    split = filepath.split('/')
    split[-1] = split[-1].replace('_', ' ')
    newFilepath = '/'.join(split)
    os.rename(filepath, newFilepath)