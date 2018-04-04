

function requestAQ(coords, radius){
	var req = new XMLHttpRequest();
	var coordsArr = null;
	var requestObj = getRequestObject(coords, radius);

	//console.log(requestObj);
	//var str = JSON.stringify(requestObj);
	console.log(requestObj);

    $.get( "https://api.openaq.org/v1/measurements", requestObj )
        .done(function( obj ) {
            console.log(obj);
            drawTable(obj);
            coordsArr = getCoords(obj);
            createMarkers(coordsArr);
        });

	// // On request completion
	// req.onreadystatechange = function(){
	// 	if (req.readyState==4 && req.status ==200){
	// 		var obj = JSON.parse(req.responseText);
	// 		drawTable(obj);
     //        coordsArr = getCoords(obj);
     //        createMarkers(coordsArr);
	// 	}
	// };
	// var params="coordinates=" + coords + "&radius=" + radius + "&parameter=" + parameter + "&sort=date";
	// req.open("GET", "https://api.openaq.org/v1/latest"+"?"+params, true);
	// req.send();
}

function getCoords(obj) {
    var results = obj.results;
    var coordArray = [];
    for (var i = 0; i < results.length; i++) {
        coordArray[i] = results[i].coordinates.longitude + ',' + results[i].coordinates.latitude + ',' + results[i].location;
    }
    return coordArray;
}
function drawTable(obj){
	var results = obj.results;
	var str = "";
	for (var i = 0; i < results.length; i++){
		str += "<tr>";
		str += "<td>" + results[i].location + "</td>";
		str += "<td>" + results[i].parameter + "</td>";
		str += "<td>" + results[i].value + " " + results[i].unit + "</td>";
		str += "<td>" + results[i].lastUpdated + "</td>";
		str += "</tr>"

		$("#dataTable tbody").html(str);
	}
}

function getRequestObject(coords, radius){
    // function to get parameters from dom to send for AQrequest. Returns an object
    var parameters = [];
    var checkboxes = $("#checkboxContainer input").toArray();
    checkboxes.forEach(function(checkbox){
        if (checkbox.checked){
            parameters.push(checkbox.id);
        }
    });
    console.log(parameters);
    var requestObject = {"coordinates": coords, "radius": radius, "parameter[]": parameters, date_from:"2018-04-03T16:00:00"};
    return requestObject;
}