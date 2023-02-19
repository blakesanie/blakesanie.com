from optimize import optimizeImage
import sys
import os

if __name__ == '__main__':
    filepath = os.path.join('public', 'images', sys.argv[1])
    optimizeImage(filepath)
