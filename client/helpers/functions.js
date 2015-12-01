/*
    Create a marker on the map.

    Not sure if this is being used...
*/
createMarker = function(map, point, name) {
	if(name === undefined) {
		var marker = new google.maps.Marker({
			position: point,
			map: map
		});
	}
	else {
		var marker = new google.maps.Marker({
    	    position: point,
    	    map: map,
    	    title: name
	    });
	}
}

/*
    Get the current time in a String
*/
getDateTime = function(){
    var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds(); 

    if(month.toString().length == 1) {
        var month = '0'+month;
    }
    if(day.toString().length == 1) {
        var day = '0'+day;
    }   
    if(hour.toString().length == 1) {
        var hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
        var minute = '0'+minute;
    }
    if(second.toString().length == 1) {
        var second = '0'+second;
    }   
    var dateTime = year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;   
    return dateTime;
}

/**
    Computes the shortest path from start to end that visits all locations
        in wayPts

    INPUT PARAMETERS:
        - dService = google.maps.DirectionsService
        - start = google.maps.LatLng 
            the start location
        - wayPts = [google.maps.LatLng]
            list of intermediate locations
        - end = google.maps.LatLng
            the end location
        - callback = callback to be called
            It should say that once all the responses have been computed, plot
            the shortest route.

    OUTPUT:
        - response
            the information about the route calculated
*/
calculateShortestRoute = function(dService, start, wayPts, end, callback) {
    dService.route({
        origin: start,
        destination: end,
        waypoints: wayPts,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING
    }, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            callback(response);
        } else {
            window.alert('Directions request failed due to ' + status);
            throw "Directions request failed due to " + status;
        }
    });
}


/**
    Computes the path visiting all points in exact order.
    Calls a callback function on the response / result.

    INPUT PARAMETERS:
        - dService = google.maps.DirectionsService
        - points = list of locations
        - callback = callback to be called
            It should say that once all the responses have been computed

    OUTPUT:
        - None
*/
calculateRoute = function(dService, points, callback) {
    middlePoints = [];
    points.slice(1, points.length - 1).forEach( function(loc) {
        middlePoints.push({
            location: loc,
            stopover: true
        });
    });

    dService.route({
        origin: points[0],
        destination: points[points.length - 1],
        waypoints: middlePoints,
        optimizeWaypoints: false,
        travelMode: google.maps.TravelMode.DRIVING
    }, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            callback(response);
        } else {
            window.alert('Directions request failed due to ' + status);
            throw "Directions request failed due to " + status;
        }
    });
}

/*
    Computes the path visiting all points in exact order.
    Plots the path on the Google Map stored in dDisplay.

    INPUT PARAMETERS:
        - dService = google.maps.DirectionsService
        - dDisplay = google.maps.DisplayService
        - points = list of locations

    OUTPUT:
        - None
*/
calculateAndDisplayRoute = function(dService, dDisplay, points) {
    calculateRoute(dService, points, function(routeCalculationResponse) {
        dDisplay.setDirections(routeCalculationResponse);
    });
}