
Template.pathsHeader.events({
    /**
        Remove all paths in Paths Metor Collection
        Also reactively removes all paths from the HTML
    */
    'click #removeAllPaths': function(event, template){
        Meteor.call('removeAllPaths');
    }
});

Template.paths.helpers({
    /**
        Return all paths in the Paths Meteor Collection, newest first.
    */
	getPaths: function() {
        return Paths.find({}, {sort: {'dateCreated': -1}});
    }
});


/*
    Run this function when the entire paths template is rendered.

    For each path in the Paths Meteor Collection, display items:
        (1) Google Map
        (2) locations
        (3) shortest path
*/
Template.paths.rendered = function() {
    Tracker.autorun(function() {
        if(GoogleMaps.loaded() && Paths.find().count() > 0) {
            Paths.find().forEach(function(pathObj) {

                var pathLength = pathObj.path.length;
                var mapName = 'pathItemMap' + pathObj.pathName;
                var elementName = 'pathItemMap' + pathObj.pathName;
                var mapElement = document.getElementById(elementName);

                /*
                    Create map.
                    Recenter map around center of locations in pathObj

                    Place markers (maybe async?)
                */
                map = new google.maps.Map(mapElement, {
                    center: calculateCenter(pathObj),
                    zoom: 7
                });
                
                placeMarkers(map, pathObj);

                /*
                    Calculate and show directions (async code)
                */
                var directionsService = new google.maps.DirectionsService;
                var directionsDisplay = new google.maps.DirectionsRenderer;
                directionsDisplay.setMap(map);


                var points = [];
                for(var i=0; i < pathLength; i++) {
                    points.push( new google.maps.LatLng(
                        pathObj.path[i].latitude,
                        pathObj.path[i].longitude
                    ));
                }

                calculateAndDisplayShortestRoute(directionsService, 
                                                directionsDisplay,
                                                points); 
          
            });
        }
    });
};


/**
    Place markers on the map.
    Resize the map to include all markers aesthetically within view.

    INPUT PARAMETERS:
        - map = Google Maps Map object
        - pathObj = the map's path object, containing various locations

    OUTPUT PARAMETERS:
        - None
*/
function placeMarkers(map, pathObj) {
    var bounds = new google.maps.LatLngBounds();

    pathObj.path.forEach(function(location){
        var position = new google.maps.LatLng(location.latitude, location.longitude);
        createMarker(map, position);

        bounds.extend(position);
    });

    map.fitBounds(bounds);
}

/**
    Calculate the center of the Map by observing its path object.

    INPUT PARAMETERS:
        - pathObj = the map's path object, containing various locations.

    OUTPUT:
        - Google Maps LatLng object containing center of locations in pathObj
*/
function calculateCenter(pathObj) {
    var sumLat = 0;
    var sumLng = 0;
    pathObj.path.forEach(function(location){
        sumLat += location.latitude;
        sumLng += location.longitude;
    });
    var avgLat = sumLat / pathObj.path.length;
    var avgLng = sumLng / pathObj.path.length;
    return new google.maps.LatLng(
        avgLat, avgLng
    );
}

/**
    Calculate and display shortest route visiting all points on map. 

    INPUT PARAMETERS:
        - dService = google.maps.DirectionsService
        - dDisplay = google.maps.DirectionsDisplay
        - points = [google.maps.LatLng]
            list of locations to visit
        

    OUTPUT:
        - dDisplay will display the shortest path that visits all locations
*/
function calculateAndDisplayShortestRoute(dService, dDisplay, points) {
    var response_array = [];
    var numPairs = (points.length) * (points.length - 1) / 2;

    /*
        Callback function that takes the response from a route calculation.

        Push the route calculation response into array.
        If all calculations have been performed (# responses = numPairs),
            then display the route with the minimum distance.
    */
    var funcCount = function(routeCalculationResponse) {

        response_array.push(routeCalculationResponse);

        if(response_array.length === numPairs ) {

            var minDistance = 1 << 30;
            var minIndex = -1;
            for(var i=0; i<response_array.length; i++) {
                var response = response_array[i];
                var sumDistance = 0;
                var legs = response.routes[0].legs;
                legs.forEach( function(leg) {
                    sumDistance += leg.distance.value;
                });
                if(sumDistance < minDistance) {
                    minDistance = sumDistance;
                    minIndex = i;
                }
            }

            displayRoute(dDisplay, response_array[minIndex]);
        }
    };

    /*
        Push the points into waypoints array.
    */
    wayPoints = [];
    for(var i = 0; i < points.length; i++) {
        wayPoints.push({
            location: points[i],
            stopover: true
        });
    }

    /*
        For each start,
            for each end,
                calculate the shortest path that visits all waypoints.
    */
    for(var startIndex = 0; startIndex < points.length; startIndex++) {
        var wPLeft = wayPoints.slice(0, startIndex);

        for(var endIndex = startIndex + 1; endIndex < points.length; endIndex++) {
            var wPRight = wayPoints.slice(endIndex + 1);

            var wPts = wPLeft.concat(wayPoints.slice(startIndex + 1, endIndex)).concat(wPRight);

            calculateRoute(dService,
                            points[startIndex],
                            wPts,
                            points[endIndex],
                            funcCount);

        }
    }
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
function calculateRoute(dService, start, wayPts, end, callback) {
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
    INPUT PARAMETERS:
        - dDisplay = google.maps.DirectionsDisplay
        - directionsResult
            the route information
*/
function displayRoute(dDisplay, directionsResult) {
    dDisplay.setDirections(directionsResult);
}



Template.pathItem.onCreated(function() {
    // none
});
