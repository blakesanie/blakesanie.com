var str = "";
for (var i = 0; i < 10000; i++) {
  if (Math.random() < 0.2) {
    str += "<sp>" + "@#*,.".charAt(Math.floor(Math.random() * 5)) + "</sp>";
  }
  str += "‏‏‎ ‎";
}
