

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
            updatePoints(obj)
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

    var checkboxArray = $("#checkboxContainer input[type=checkbox]").toArray();
    var checkedParameters = [];
    for (var i = 0; i < checkboxArray.length; i++){
        // for each checkbox, if checked, add that id to the param array
        if (checkboxArray[i].checked){
            checkedParameters.push(checkboxArray[i].name);
        }
    }

    for (var i = 0; i < results.length; i++){ // for each data point we have gotten
        for (var j = 0; j < results[i].measurements.length; j++) { // for each measurement contained in data point
            if (checkedParameters.includes(results[i].measurements[j].parameter)) { // measurement in checked params
                results[i].measurements[j].displayed = true;
            } else {
                results[i].measurements[j].displayed = false;
            }
        }
        var lastUpdated = results[i].measurements[0].lastUpdated;
        for (var j = 0; j < checkedParameters.length; j++){ // for each checked parameter
            if (!results[i].measurements.some(e => e.parameter === checkedParameters[j])){
                var emptyMeasurement = {parameter: checkedParameters[j], value: "---", displayed: true, lastUpdated: lastUpdated};
                results[i].measurements.splice(j, 0, emptyMeasurement);
            }
        }
    }

    var scope = angular.element($("#dataTable")).scope();
    scope.$apply(function(){
        scope.data = results;
        scope.checkedParameters = checkedParameters;
    })
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
    var requestObject = {"coordinates": coords, "radius": radius};
    return requestObject;
}

