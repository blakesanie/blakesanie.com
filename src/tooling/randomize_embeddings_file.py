import random
import os

r = str(int(random.random() * 100000000))
filepath = 'public/assets/imageEmbeddings.json'
newFilepath = filepath.replace('.', '_' + r + '.')

try:
    os.rename(filepath, newFilepath)
except FileNotFoundError:
    print(f"warning - File {filepath} not found")
    pass

pagePath = 'src/pages/photo/index.astro'

with open(pagePath, 'r') as file:
    lines = file.readlines()

comment = 'replace embeddings at build time'

file_content = ''
found = False
for line in lines:
    if comment in line:
        line = f'fetch("/assets/imageEmbeddings_{r}.json"), // {comment}\n'
        found = True
    file_content += line

assert found, f'Comment "{comment}" not found in the file before processing.'
assert comment in file_content, f'Comment "{comment}" not found in the file after processing.'

# Perform the replacement
modified_content = file_content.replace('imageEmbeddings.json', 'imageEmbeddings_' + r + '.json')

# Write the modified content back to the file
with open(pagePath, 'w') as file:
    file.write(modified_content)
    