// function map() {
//   var map = L.map("map").setView([51.505, -0.09], 13);

//   // Add a tile layer to the map
//   L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     attribution:
//       '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//   }).addTo(map);

//   //   // Load the overpass.json data
//   //   fetch("/overpass.json")
//   //     .then((response) => response.json())
//   //     .then((data) => {
//   //       // Add the data to the map
//   //       L.geoJSON(data).addTo(map);
//   //     })
//   //     .catch((error) => console.error("Error loading overpass.json:", error));
// }

// function waitForLeaflet() {
//   if (L) {
//     map();
//   } else {
//     setTimeout(waitForLeaflet, 10);
//   }
// }
