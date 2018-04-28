// Initialize Firebase
  var config = {
    apiKey: "AIzaSyBlEL1Gljl6CntCHYBZF21TqGx417nFFug",
    authDomain: "gadgets-3a712.firebaseapp.com",
    databaseURL: "https://gadgets-3a712.firebaseio.com",
    projectId: "gadgets-3a712",
    storageBucket: "gadgets-3a712.appspot.com",
    messagingSenderId: "826221086968"
  };
  firebase.initializeApp(config);

var firestore = firebase.firestore();
var auth = firebase.auth();


function upload() {
    var name = $("#name").val()
        price = $("#price").val(),
        flexible = false,
        imageURL = $("#imageUrl").val(), 
        purchaseURL = $("#purchaseUrl").val();
    //if blanks not all filled
    if (name == "" || price == "" || imageURL == "" || purchaseURL == "") {
        alert("fill all fields");
    } else {
        var ref = firestore.collection("techProducts").doc(name).set({
            price: parseInt(price),
            imageUrl: imageURL,
            purchaseUrl: purchaseURL,
            index: Math.random(),
            clicks: 0
        }).then(function() {
            alert("success");
        }).catch(function(error) {
           alert(error); 
        });
    }
}

$("#imageUrl").change(function() {
   $("img").attr("src",$("#imageUrl").val()); 
});