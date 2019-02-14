var express = require("express");
var app = express();

app.use(express.static("spotifyMosaic"));
app.listen(8888);

console.log("Listening on 8888");
