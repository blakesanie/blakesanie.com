cd public
tree . -L 2 > tree.txt
cd ..
cd src
cd pages
cd Bookmarks
python3 formatBookmarks.py
npm run deploy