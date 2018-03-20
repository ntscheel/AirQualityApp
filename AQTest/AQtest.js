var ip1 = "129.7.135.130"
var ip2 = "140.209.25.62"
var obj1;
var obj2;

function clickFunction(){
	var coords = document.getElementById("coords").value;
	var radius = document.getElementById("radius").value;
	var parameter = document.getElementById("parameter").value;
	
	console.log("coordinates: " + coords);
	console.log("radius: " + radius);
	request(coords, radius, parameter);

}

function request(coords, radius, parameter){
	var req = new XMLHttpRequest();
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
	var table = document.getElementById("AQTable");
	var old_tbody = document.getElementById("aqbody");
	var new_tbody = document.createElement('tbody');
	
	var results = obj.results;
	console.log(results.length);
	for (var i = 0; i < results.length; i++){
		console.log("test2");
		var row = new_tbody.insertRow(-1);
		var cell_location = row.insertCell(0);
		var cell_parameter = row.insertCell(1);
		var cell_value = row.insertCell(2);
		var cell_date = row.insertCell(3);
		
		cell_location.innerHTML = results[i].location;
		cell_parameter.innerHTML = results[i].measurements[0].parameter;
		cell_value.innerHTML = results[i].measurements[0].value + " " + results[i].measurements[0].unit;
		cell_date.innerHTML = results[i].measurements[0].lastUpdated;
	}
	old_tbody.parentNode.replaceChild(new_tbody, old_tbody);
	new_tbody.setAttribute("id", "aqbody");
	console.log("end draw table");
}

function requestReadyStateChange(){
	if (this.readyState === 4 && this.status === 200){
		this.promise_resolve;
	} else if (this.readyState === 4 && this.status != 200){
		this.promise_reject;
	}
	
}




function getDistance(){
	lat1 = toRadians(obj1.latitude);
	lat2 = toRadians(obj2.latitude);
	lon1 = toRadians(obj1.longitude);
	lon2 = toRadians(obj2.longitude);
	var a = Math.pow(Math.sin((lat1 - lat2)/2), 2) + Math.cos(lat1)*Math.cos(lat2)*Math.pow(Math.sin((lon1-lon2)/2),2);
	console.log("a is " + a);
	var c = 2*Math.asin(Math.sqrt(a));
	console.log("c is " + c);
	var dist = 3959*c; // radius of earth is about 3959 miles
	console.log(dist);
	return dist;
}

function toRadians(degrees){
	return degrees*(Math.PI/180);
}
