# read json file and print it as a dict
import json

 
with open('../redirects.json') as json_file:
    data = json.load(json_file)
    out = []
    for route, attributes in data.items():
        if route == 'email':
            continue
        out.append({
            "source": '/' + route,
            "destination": attributes['href'],
        })
    print(json.dumps(out))


