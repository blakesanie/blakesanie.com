import json

objects = []

with open('./bookmarks.json') as json_file:
    data = json.load(json_file)
    for bookmark in data["roots"]["bookmark_bar"]["children"]:
        print(bookmark)
        object = {}
        object["title"] = bookmark["name"]
        object["HREF"] = bookmark["url"]
        object["ADD_DATE"] = int(bookmark["date_added"])
        objects.append(object)

# with open("./bookmarks.html") as file:
#     text = file.read()
#     file.close()

# items = text.split("<DT>")[2:]

# objects = []

# for i, item in enumerate(items):
#     # print(item)
#     object = {}
#     object["title"] = item[item.index(">") + 1:item.index("</A>")]
#     pairs = item[item.index("<A") + 2: item.index(">")].strip().split(" ")
#     for pair in pairs:
#         splitIndex = pair.index('=')
#         key = pair[:splitIndex]
#         value = pair[splitIndex + 2:-1]
#         if value.isnumeric():
#             value = int(value)
#         object[key] = value
#     objects.append(object)

# print(objects)

with open("./bookmarkData.js", "w") as json_file:
    json_file.write("module.exports.bookmarks = {};".format(
        json.dumps(objects)))
    json_file.close()


# print(items)

# json_data = json.dumps(data_dict)
