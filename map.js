<!-- Google Maps API key: AIzaSyDCsSg_0-Xce4utRO6SanxQD1hPGCm7GYc -->

var map;
var markers = [];
var infoWindow;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 44.940623, lng: -93.193660},
        zoom: 13,
        mapTypeId: 'roadmap'
    });
    infoWindow = new google.maps.InfoWindow;
    var geocoder = new google.maps.Geocoder;

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    input.addEventListener('focus', function() {
       input.value = "";
    });

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });


    // Add a listener that populates our data table when
    // the map idles
    map.addListener('dragend', function() {
        var LatLng = map.getCenter();
        var latlngStr = (LatLng.lat() + "," + LatLng.lng());
        geocodeLatLng(geocoder, map, infoWindow, latlngStr, input); // Get location name
    });
    map.addListener('idle', function() {
        var LatLng = map.getCenter();
        requestAQ(LatLng.lat() + "," + LatLng.lng(), 10000, "pm25");
    });


    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
}

function createMarkers(coordsArr){
    if(coordsArr){
        // Clear out the old markers.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];
        var newMarker;
        var coordSplit;
        for(var i = 0; i < coordsArr.length; i++){
            coordSplit = coordsArr[i].split(',',3);
            var latLng = new google.maps.LatLng((parseFloat(coordSplit[1])), (parseFloat(coordSplit[0])));

            newMarker = new google.maps.Marker({
                position: latLng,
                map: map
            });
        }
    }

}

function geocodeLatLng(geocoder, map, infowindow, latlngInput, input) {
    var latlngStr = latlngInput.split(',', 2);
    var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
    geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === 'OK') {
            if (results[0]) {
                input.value = results[0].formatted_address;
            } else {
                window.alert('No results found');
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
        }
    });
}
