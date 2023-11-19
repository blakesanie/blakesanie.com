import random
import os

r = str(int(random.random() * 100000000))
filepath = 'public/assets/imageEmbeddings.json'
newFilepath = filepath.replace('.', '_' + r + '.')

os.rename(filepath, newFilepath)

pagePath = 'src/pages/photo/index.astro'

with open(pagePath, 'r') as file:
    file_content = file.read()

# Perform the replacement
modified_content = file_content.replace('imageEmbeddings.json', 'imageEmbeddings_' + r + '.json')

# Write the modified content back to the file
with open(pagePath, 'w') as file:
    file.write(modified_content)
    