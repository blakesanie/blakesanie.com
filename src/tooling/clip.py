from transformers import CLIPProcessor, CLIPModel
from PIL import Image
from glob import glob
from multiprocessing import Pool
from tqdm import tqdm
import json
import torch

def clip():

    model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
    processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")


    path = '../assets/images/portfolio'

    filepaths = glob(path + '/*')
        
    print('found files')    
    images = [Image.open(filepath) for filepath in filepaths]
    print('opened images')
    inputs = processor(images=images, return_tensors="pt")
    print('processed images')
    embeddings = model.get_image_features(**inputs)
    embeddings /= torch.norm(embeddings, p=2, dim=-1, keepdim=True)
    embeddings = embeddings.detach().numpy().tolist()
    print('extracted embeddings')

    out = {}

    for filepath, embedding in zip(filepaths, embeddings):
        name = filepath.split('/')[-1].split('.')[0]
        out[name] = [ float("{:0.4f}".format(x)) for x in embedding]

    with open("../../public/assets/imageEmbeddings.json", "w") as outfile:
        json.dump(out, outfile)
        
if __name__ == '__main__':
    clip()