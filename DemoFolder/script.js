// Initialize the map and set default view (centered on a default location)
var map = L.map('map').setView([20.5937, 78.9629], 5);  // Default to India's center

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Kabadiwala's hardcoded locations
var kabadiwalas = [
    { lat: 19.0760, lon: 72.8777, name: 'Kabadiwala 1' },  // Example Mumbai location
    { lat: 28.7041, lon: 77.1025, name: 'Kabadiwala 2' },  // Example Delhi location
    { lat: 12.9716, lon: 77.4125, name: 'Kabadiwala 3' }   // Example Bangalore location
];

// Function to calculate distance using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the Earth in km
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var distance = R * c;  // Distance in km
    return distance;
}

// Function to add Kabadiwala markers on the map
function addKabadiwalaMarkers(userLocation) {
    kabadiwalas.forEach(kabadiwala => {
        var distance = calculateDistance(userLocation.lat, userLocation.lon, kabadiwala.lat, kabadiwala.lon);

        // If the Kabadiwala is within 500 km for this demo
        if (distance < 500) {
            var marker = L.marker([kabadiwala.lat, kabadiwala.lon]).addTo(map)
                .bindPopup(`${kabadiwala.name} - ${distance.toFixed(2)} km away`).openPopup();
        }
    });
}

// Locate the user's position
map.locate({ setView: true, maxZoom: 12 });

// Event listener when location is found
map.on('locationfound', function (e) {
    var userMarker = L.marker(e.latlng).addTo(map)
        .bindPopup("You are here").openPopup();

    // Add nearby Kabadiwala markers after finding user's location
    addKabadiwalaMarkers({ lat: e.latlng.lat, lon: e.latlng.lng });
});

// Event listener for location errors
map.on('locationerror', function (e) {
    alert("Location access denied.");
});
