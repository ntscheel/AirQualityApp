<!-- Google Maps API key: AIzaSyDCsSg_0-Xce4utRO6SanxQD1hPGCm7GYc -->

var map, heatmap;
var markers = [];
var infoWindow;
var gradient = [
    'rgba(0, 255, 255, 0)',
    'rgba(0, 255, 255, 1)',
    'rgba(0, 191, 255, 1)',
    'rgba(0, 127, 255, 1)',
    'rgba(0, 63, 255, 1)',
    'rgba(0, 0, 255, 1)',
    'rgba(0, 0, 223, 1)',
    'rgba(0, 0, 191, 1)',
    'rgba(0, 0, 159, 1)',
    'rgba(0, 0, 127, 1)',
    'rgba(63, 0, 91, 1)',
    'rgba(127, 0, 63, 1)',
    'rgba(191, 0, 31, 1)',
    'rgba(255, 0, 0, 1)'
];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 44.940623, lng: -93.193660},
        zoom: 13,
        mapTypeId: 'roadmap'
    });

    heatmap = new google.maps.visualization.HeatmapLayer();

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


    map.addListener('dragend', function() {
        var LatLng = map.getCenter();
        var latlngStr = (LatLng.lat() + "," + LatLng.lng());
        geocodeLatLng(geocoder, map, infoWindow, latlngStr, input); // Get location name
    });

    // Get air quality data and repopulate table on map idle
    map.addListener('idle', function() {
        var LatLng = map.getCenter();
        var radius = calculateRadius(LatLng.lat(), map.zoom);
        requestAQ(LatLng.lat() + "," + LatLng.lng(), radius);
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


    function updateMap(){
        var LatLng = map.getCenter();
        var latlngStr = (LatLng.lat() + "," + LatLng.lng());
        var radius = calculateRadius(LatLng.lat(), map.zoom);
        geocodeLatLng(geocoder, map, infoWindow, latlngStr, input); // Get location name
        requestAQ(LatLng.lat() + "," + LatLng.lng(), radius);
    }

    $('#checkboxContainer > div > input').click(function(){
        updateMap();
    });

    updateMap();


}

function createMarkers(results){
    if(results){
        // Clear out the old markers.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];
        var newMarker;
        var infowindow;
        for(var i = 0; i < results.length; i++){
            var loc = results[i].location;
            var lat = parseFloat(results[i].coordinates.latitude);
            var lng = parseFloat(results[i].coordinates.longitude);
            var latLng = new google.maps.LatLng(lat, lng);

            var content = "<b>" + loc + "</b>";
            var data = results[i].measurements;
            if(data.length > 0){
                for(var j = 0; j < data.length; j++){
                    content += "<p>" + data[j].parameter + ": " + data[j].value + " " + data[j].unit + "</p>";
                }
            }

            newMarker = new google.maps.Marker({
                position: latLng,
                title: loc,
                map: map
            });
            markers.push(newMarker);

            infowindow = new google.maps.InfoWindow();

            google.maps.event.addListener(newMarker,'click', (function(newMarker,content,infowindow){
                return function() {
                    infowindow.setContent(content);
                    infowindow.open(map,newMarker);
                };
            })(newMarker,content,infowindow));
        }
        var markerCluster = new MarkerClusterer(map, markers,
            {
                styles: [
                    {
                        textColor: 'white',
                        url: 'm/m1.png',
                        height: 52,
                        width: 53
                    },
                    {
                        textColor: 'white',
                        url: 'm/m2.png',
                        height: 55,
                        width: 56
                    },
                    {
                        textColor: 'white',
                        url: 'm/m3.png',
                        height: 65,
                        width: 66
                    },
                    {
                        textColor: 'white',
                        url: 'm/m4.png',
                        height: 77,
                        width: 78
                    },
                    {
                        textColor: 'white',
                        url: 'm/m5.png',
                        height: 89,
                        width: 90
                    }
                ]
            });

    }
}

function toggleHeatMap() {
    var checkboxArray = $("#checkboxContainer input[type=checkbox]").toArray();
    var checkedParameters = [];
    for (var i = 0; i < checkboxArray.length; i++) {
        // for each checkbox, if checked, add that id to the param array
        if (checkboxArray[i].checked) {
            checkedParameters.push(checkboxArray[i].name);
        }
    }

    if (heatmap.getMap()) {
        $('#heatMapButton').html("Toggle Heat Map On");
        heatmap.setMap(null);
    } else if (checkedParameters.length == 1){
        $('#heatMapButton').html("Toggle Heat Map Off");
        heatmap.setMap(map);
    }
}

function updatePoints(data){
    var checkboxArray = $("#checkboxContainer input[type=checkbox]").toArray();
    var checkedParameters = [];
    for (var i = 0; i < checkboxArray.length; i++) {
        // for each checkbox, if checked, add that id to the param array
        if (checkboxArray[i].checked) {
            checkedParameters.push(checkboxArray[i].name);
        }
    }

    if (checkedParameters.length != 1){
        return;
    }

    var parameter = checkedParameters[0];
    var results = data.results;
    var LatLngArray = [];
    var newLatLng;
    var weight;
    var weightedDataPoint;

    for(var i=0; i < results.length; i++) {
        newLatLng = new google.maps.LatLng(results[i].coordinates.latitude, results[i].coordinates.longitude);
        //get value of right parameter
        for(var j=0; j < results[i].measurements.length; j++){
            if (results[i].measurements[j].parameter == parameter){
                weight = results[i].measurements[j].value;
                if(weight == "---"){
                    weight = 0;
                }
            }
        }
        weightedDataPoint = {location: newLatLng, weight: weight};
        LatLngArray.push(weightedDataPoint);
    }

    heatmap.setMap(null);
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: LatLngArray,
        map: heatmap.getMap()
    });
    heatmap.set('gradient', gradient);

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

function calculateRadius(latitude, zoomLevel){
    var width = $("#map").width();
    var height = $("#map").height();
    var pixelRadius = Math.sqrt(width*width/4 + height*height/4);

    // Equation from this post by a Google employee:
    // https://groups.google.com/forum/#!topic/google-maps-js-api-v3/hDRO4oHVSeM
    metersPerPixel = 156543.03392 * Math.cos(latitude * Math.PI / 180) / Math.pow(2, zoomLevel);

    // If metersPerPx is correct, we should be able to just multiply our two values
    // pixelRadius * metersPerPixel should give us the radius length in meters
    return pixelRadius * metersPerPixel;
}
