function right() {
  document.getElementById("right").style.display = "none";
  document.getElementById("wrong").style.display = "none";
  document.getElementById("dismiss").style.display = "block";
  document.getElementsByTagName("BODY")[0].style.backgroundColor = "green";
}

function wrong() {
  document.getElementById("right").style.display = "none";
  document.getElementById("wrong").style.display = "none";
  document.getElementById("dismiss").style.display = "block";
  document.getElementsByTagName("BODY")[0].style.backgroundColor = "red";
}

function dismiss() {
  document.getElementById("right").style.display = "block";
  document.getElementById("wrong").style.display = "block";
  document.getElementById("dismiss").style.display = "none";
  document.getElementsByTagName("BODY")[0].style.backgroundColor = "blue";
}
