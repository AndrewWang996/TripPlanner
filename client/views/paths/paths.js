
Template.pathsHeader.events({
    'click #removeAllPaths': function(event, template){
        Meteor.call('removeAllPaths');
    }
});

Template.pathItemHeader.events({
  'click .js-delete-path': function(event, template) {
    // if (confirm(getError('confirm-remove-path'))) {
        Meteor.call('removePath', this._id, function (error) {
            if (error)
                alert(error.reason)
        });
    // }
    }
});

Template.paths.helpers({
	paths: function() {
		// return Paths.find({}, {sort: {'info.date': 1}});
        return Paths.find({}, {sort: {'dateCreated': -1}});
        // return Paths.find({}, {sort: {date: 1, time: 1}});
    }
});

Template.paths.rendered = function() {
  // setTimeout(function() {
    Tracker.autorun(function() {
        if(GoogleMaps.loaded() && Paths.find().count() > 0) {
            Paths.find().forEach(function(pathObj) {

            var pathLength = pathObj.path.length;

            /*
            Calculate marker locations (should be sync code)
            */
            var sumLat = 0;
            var sumLng = 0;
            pathObj.path.forEach(function(location){
                sumLat += location.latitude;
                sumLng += location.longitude;
            });
            var avgLat = sumLat / pathObj.path.length;
            var avgLng = sumLng / pathObj.path.length;

            var mapName = 'pathItemMap' + pathObj.pathName;
            var elementName = 'pathItemMap' + pathObj.pathName;
            var mapElement = document.getElementById(elementName);

            /*
            Place markers (maybe async?)
            */
            map = new google.maps.Map(mapElement, {
                center: new google.maps.LatLng(avgLat, avgLng),
                zoom: 7
            });
            
            var bounds = new google.maps.LatLngBounds();

            pathObj.path.forEach(function(location){
                var position = new google.maps.LatLng(location.latitude, location.longitude);
                createMarker(map, position);

                bounds.extend(position);
            });

            map.fitBounds(bounds);

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

    wayPoints = [];
    for(var i = 0; i < points.length; i++) {
        wayPoints.push({
            location: points[i],
            stopover: true
        });
    }

    for(var startIndex = 0; startIndex < points.length; startIndex++) {
        wPLeft = wayPoints.slice(0, startIndex);

        for(var endIndex = startIndex + 1; endIndex < points.length; endIndex++) {
            wPRight = wayPoints.slice(endIndex + 1);

            calculateRoute(dService,
                            points[startIndex],
                            wPLeft.concat(wayPoints.slice(startIndex + 1, endIndex)).concat(wPRight),
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

    // We can use the `ready` callback to interact with the map API once the map is ready.
    // GoogleMaps.ready('pathItemMapEurope Tour', function(map) {

    //   // Add a marker to the map once it's ready
    //   var marker = new google.maps.Marker({
    //     position: map.options.center,
    //     map: map.instance
    //   });
    // });
});
