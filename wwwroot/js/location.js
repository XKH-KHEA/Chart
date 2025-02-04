const connection = new signalR.HubConnectionBuilder()
    .withUrl("/locationHub")
    .build();

let map;
let userMarkers = {};

async function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 0, lng: 0 },
        zoom: 3,
    });

    connection.start().then(() => console.log("SignalR Connected"));
    trackLocation();
}

function trackLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            connection.invoke("SendLocation", "User1", latitude, longitude)
                .catch(err => console.error(err));
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

connection.on("ReceiveLocation", (user, latitude, longitude) => {
    if (!userMarkers[user]) {
        userMarkers[user] = new google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            map: map,
            title: user
        });
    } else {
        userMarkers[user].setPosition(new google.maps.LatLng(latitude, longitude));
    }
});
