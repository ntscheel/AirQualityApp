

function requestAQ(coords, radius, parameter){
	var req = new XMLHttpRequest();
	var coordsArr = null;
	// console.log("requestAQ called");
	req.onreadystatechange = function(){
		if (req.readyState==4 && req.status ==200){
			var obj = JSON.parse(req.responseText);
			drawTable(obj);
            coordsArr = getCoords(obj);
            createMarkers(coordsArr);

		}
	}
	var params="coordinates=" + coords + "&radius=" + radius + "&parameter=" + parameter + "&sort=date";
	req.open("GET", "https://api.openaq.org/v1/latest" +"?"+params, true);
	req.send();

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
		str += "<td>" + results[i].measurements[0].parameter + "</td>";
		str += "<td>" + results[i].measurements[0].value + " " + results[i].measurements[0].unit + "</td>";
		str += "<td>" + results[i].measurements[0].lastUpdated + "</td>";
		str += "</tr>"

		$("#dataTable tbody").html(str);
	}
}
