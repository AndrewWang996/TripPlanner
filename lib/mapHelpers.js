GLOBAL.MapHelpers = {
    /*
     Converts a Path object into an array of google.maps.LatLng points

     INPUT PARAMETERS:
     path: a Path object as defined by the Path Schema
     */
    pathToPoints: function(path) {
        var points = [];
        var pathLength = path.length;
        for(var i=0; i < pathLength; i++) {
            points.push( new google.maps.LatLng(
                path[i].latitude,
                path[i].longitude
            ));
        }
        return points;
    },

    /*
     Set up the map.

     INPUT PARAMETERS:
     map: Google Maps Map that needs to be set up.
     pathObj: the path object as given by pathSchema.
     */
    setUpMap: function(map, directionsService, directionsDisplay, pathObj) {
        this.placeMarkers(map, pathObj);

        /*
         Calculate and show directions (async code)
         */
        directionsDisplay.setMap(map);

        var points = this.pathToPoints(pathObj.path);

        this.calculateAndDisplayRoute(directionsService,
            directionsDisplay,
            points);
    },

    /*
     Create a marker on the map.

     Not sure if this is being used...
     */
    createMarker: function(map, point, name) {
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
    },

    /**
     Place markers on the map.
     Resize the map to include all markers aesthetically within view.

     INPUT PARAMETERS:
     - map = Google Maps Map object
     - pathObj = the map's path object, containing various locations

     OUTPUT PARAMETERS:
     - None
     */
    placeMarkers: function(map, pathObj) {
        var bounds = new google.maps.LatLngBounds();
        var self = this;

        pathObj.path.forEach(function(location){
            var position = new google.maps.LatLng(location.latitude, location.longitude);
            self.createMarker(map, position);

            bounds.extend(position);
        });

        map.fitBounds(bounds);
    },

    /**
     Calculate the center of the Map by observing its path object.

     INPUT PARAMETERS:
     - pathObj = the map's path object, containing various locations.

     OUTPUT:
     - Google Maps LatLng object containing center of locations in pathObj
     */
    calculateCenter: function(pathObj) {
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
    },

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
    calculateShortestRoute: function(dService, start, wayPts, end, callback) {
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
    },


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
    calculateRoute: function(dService, points, callback) {
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
    },

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
    calculateAndDisplayRoute: function(dService, dDisplay, points) {
        this.calculateRoute(dService, points, function(routeCalculationResponse) {
            dDisplay.setDirections(routeCalculationResponse);
        });
    },

    /**
     Calculate shortest path visiting all points on map.
     Store it in Paths Collection afterward.

     @Postcondition: The shortest path visiting all points is stored in the Paths Collection.

     INPUT PARAMETERS:
     - points = [google.maps.LatLng]
     list of locations to visit
     - pathName = name of the path
     - redirectCallback = callback function to redirect to /paths


     OUTPUT:
     None
     */
    calculateAndStoreShortestRoute: function(points, pathName, redirectCallback) {
        var dService = new google.maps.DirectionsService;
        var response_array = [];
        var numPairs = (points.length) * (points.length - 1) / 2;

        /*
         Callback function that takes the response from a route calculation.

         Push the route calculation response into array.
         If all calculations have been performed (# responses = numPairs),
         then store the newly computed shortest path inside the Paths Collection.
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

                var shortestPathLegs = response_array[minIndex].routes[0].legs;

                var origin = {
                    locationName: shortestPathLegs[0].start_address,
                    latitude: shortestPathLegs[0].start_location.lat(),
                    longitude: shortestPathLegs[0].start_location.lng()
                }
                var shortestPath = [origin];
                shortestPathLegs.forEach( function(leg) {
                    shortestPath.push({
                        locationName: leg.end_address,
                        latitude: leg.end_location.lat(),
                        longitude: leg.end_location.lng()
                    });
                });

                var pathObj = {
                    'path': shortestPath,
                    'pathName': pathName,
                    'dateCreated': helpers.getDateTime()
                };

                Paths.insert(pathObj);

                // call the callback function to redirect to the /paths page.
                redirectCallback();
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

                MapHelpers.calculateShortestRoute(dService,
                    points[startIndex],
                    wPts,
                    points[endIndex],
                    funcCount);

            }
        }
    }


};