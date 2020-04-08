var str = "";
for (var i = 0; i < 10000; i++) {
    if (Math.random() < 0.2) {
        str += "<span style='opacity: "+ Math.round(Math.random() * 10) / 10 +";'>" + "@#*,.".charAt(Math.floor(Math.random() * 5)) + "</span>"
    }
    str += "‏‏‎ ‎"
}
console.log(str);
