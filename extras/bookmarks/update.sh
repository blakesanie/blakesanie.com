cat /Users/blake/Library/Application\ Support/BraveSoftware/Brave-Browser/Default/Bookmarks > bookmarks.json
python3 formatBookmarks.py
git add .
git commit -m "bookmark update"
git push