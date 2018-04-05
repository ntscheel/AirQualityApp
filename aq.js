

function requestAQ(coords, radius){
	var req = new XMLHttpRequest();
	var coordsArr = null;
	var requestObj = getRequestObject(coords, radius);

	//console.log(requestObj);
	//var str = JSON.stringify(requestObj);
	// console.log(requestObj);

    $.get( "https://api.openaq.org/v1/latest", requestObj )
        .done(function( obj ) {
            drawTable(obj);
            createMarkers(obj.results);
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

function drawTable(obj){
	var results = obj.results;
	var str = "";

	// Get a list of the checked parameter boxes.
    var checkboxArray = $("#checkboxContainer input[type=checkbox]").toArray();
    var checkedParameters = [];
    for (var i = 0; i < checkboxArray.length; i++){
        // for each checkbox, if checked, add that id to the param array
        if (checkboxArray[i].checked){
            checkedParameters.push(checkboxArray[i].name);
        }
    }

    // We have our checkedParameters - cross check data point's available measurements
	for (var i = 0; i < results.length; i++){ // for each data point we have gotten
        for (var j = 0; j < results[i].measurements.length; j++){ // for each measurement contained in data point
            // console.log("checkedParameters: " + checkedParameters);
            // console.log("parameter: " + results[i].measurements[j].parameter);
            if (checkedParameters.includes(results[i].measurements[j].parameter)){
                // We have a parameter in our datapoint that is checked - put it in table
                str += "<tr>";
                str += "<td>" + results[i].location + "</td>";
                str += "<td>" + results[i].measurements[j].parameter + "</td>";
                str += "<td>" + results[i].measurements[j].value + " " + results[i].measurements[j].unit + "</td>";
                str += "<td>" + results[i].measurements[j].lastUpdated + "</td>";
                str += "</tr>"
            }
        }
	}
    $("#dataTable tbody").html(str);
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
    // console.log(parameters);
    var requestObject = {"coordinates": coords, "radius": radius};
    return requestObject;
}

function includeMeasurement(measurement){
    // This will get called during the drawTable function to check if a data point's measurements fall within
    // the given filter constraints
    var returnBoolean = true;
    var controlArray = $("#checkboxContainer select").toArray();
    var constraintArray = $("#checkboxContainer input[type=number]").toArray();

    for (var i=0; i < resultObject.measurements.length; i++){ // for each measurement in the data point

    }
}