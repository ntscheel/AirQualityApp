

function requestAQ(coords, radius, parameter){
	var req = new XMLHttpRequest();
	console.log("requestAQ called");
	req.onreadystatechange = function(){
		if (req.readyState==4 && req.status ==200){
			var obj = JSON.parse(req.responseText);
			console.log(obj);
			drawTable(obj);
		}
	}
	var params="coordinates=" + coords + "&radius=" + radius + "&parameter=" + parameter + "&sort=date";
	req.open("GET", "https://api.openaq.org/v1/latest" +"?"+params, true);
	req.send();
}

function drawTable(obj){
	// remove old rows
	$("#dataTable tbody tr").remove();

	var results = obj.results;
	var str = "";
	for (var i = 0; i < results.length; i++){
		str += "<tr>";
		str += "<td>" + results[i].location + "</td>";
		str += "<td>" + results[i].measurements[0].parameter + "</td>";
		str += "<td>" + results[i].measurements[0].value + " " + results[i].measurements[0].unit + "</td>";
		str += "<td>" + results[i].measurements[0].lastUpdated + "</td>";
		str += "</tr>"

		$("#dataTable tbody").append(str);
	}

}
