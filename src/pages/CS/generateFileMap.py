import os
import sys

path = sys.path[0]
basePath = path.split("src")[0] + "/public/images/cs/techUsed"

out = {}

for filename in os.listdir(basePath):
    if filename[0] != ".":  # ignore .DS_store
        out[filename.split(".")[0]] = filename

print(out)
