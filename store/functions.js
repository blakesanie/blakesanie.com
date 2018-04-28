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

$(document).ready(function() {
    loadRandomProducts(); 
});




function loadTopProducts() {
    var ref = firestore.collection("techProducts");ref.orderBy("clicks").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            var name = doc.id;
            var data = doc.data();
            var imageUrl = data.imageUrl;
            var price = "$" + data.price;
            var purchaseUrl = data.purchaseUrl;
            $("#body").append("<div class='item'><img src="+ imageUrl +"><a href="+ purchaseUrl+ " target='_blank'><p>"+ name +"<br><br>"+ price +"</p></a></div>");
        });
        console.log($(".item").length);
    }).catch(function(error) {
        alert(error);  
    });
}

function loadRandomProducts() {
    var ref = firestore.collection("techProducts");ref.orderBy("clicks").get().then(function(querySnapshot) {
        var index = 0;
        querySnapshot.forEach(function(doc) {
            var name = doc.id;
            var data = doc.data();
            var imageUrl = data.imageUrl;
            var price = "$" + data.price;
            var purchaseUrl = data.purchaseUrl;
            if (index == 0) {
                $("#body").append("<div class='item'><img src="+ imageUrl +"><a><p>"+ name +"<br><br>"+ price +"</p></a></div>");
            } else {
                var pos = Math.round(Math.random() * (index - 1)) + 1;
                if (Math.random() > 0.5) {
                    $(".item:nth-of-type("+ pos +")").after("<div class='item'><img src="+ imageUrl +"><a><p>"+ name +"<br><br>"+ price +"</p></a></div>");
                } else {
                    $(".item:nth-of-type("+ pos +")").before("<div class='item'><img src="+ imageUrl +"><a><p>"+ name +"<br><br>"+ price +"</p></a></div>");
                }
            }
            index++;
        });
        console.log($(".item").length);
    }).catch(function(error) {
        alert(error);  
    });
}

/*$(window).load(function() {
   alert("load");  
});*/