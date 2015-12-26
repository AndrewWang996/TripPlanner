

/**
    When the template is rendered, call this function.
    Note: I'm not sure if the template is only rendered once.

    We geocomplete the location search field in the HTML.
    We add a listener to say that when the location is found,
        we set the Session variables to this data.

    Make the locations sortable with jQuery.
*/
Template.locEntry.onRendered(function() {

    var templateInst = this;

    Meteor.call('removeAllLocations');

    this.autorun(function () {
        if (GoogleMaps.loaded()) {
            $('#newLocation')
                .geocomplete()
                .bind('geocode:result', function(event, result){
                    if(result) {
                        var loc = result.geometry.location;

                        templateInst._latitude = loc.lat();
                        templateInst._longitude = loc.lng();
                        templateInst._locationName = this.value;
                    } 
                });
        }
    });
});

Template.locEntry.helpers({

    /**
        return the locations in Locations Meteor Collection
    */
    allLocations: function() {
        return Locations.find();
    }
});


Template.locEntry.events({

    /**
        Determines what happens after location is submitted (Enter is pressed)

        If the locations were properly geocoded (Session variables have been set),
            then proceed to:
                (1) Create location object
                (2) Add to Locations Meteor Collection
                (3) Clear / unset Session variables
                (4) Clear the HTML location entry.

        Implementation still somewhat crude.
    */
    'keyup #newLocation': function(event, template) {
        if(event.keyCode == 13) {

            if(template._latitude !== undefined) {
                var element = document.getElementById("newLocation");

                /*
                    location object to be inserted into Locations Meteor Collection
                */
                var locObj = {
                    latitude: template._latitude,
                    longitude: template._longitude,
                    locationName: template._locationName
                };

                Locations.insert( locObj );

                template._latitude = undefined;
                template._longitude = undefined;
                template._locationName = undefined;

                element.value = "";
                return false;
            }
        }
    },

    /**
        Delete the location that was just clicked on.

        @Precondition:
            - None
        @Postcondition:
            - The location clicked on has been removed from
                Locations Meteor Collection by id.
            - The location is reactively removed from HTML
    */
    'click #deleteLocation': function() {
        Locations.remove({
            _id: Locations.findOne({locationName: this.locationName})._id
        });
    },

    /**
        After clicking the "Create Path" button, create the path.

        @Precondition:
            - There must be at least 2 locations.
        @Postcondition:
            - Locations Meteor Collection is emptied.
            - Paths Meteor Collections adds the new Path.
    */
    'click #submitPath': function() {
        
        /*
            Check that there are at least 2 locations.
        */
        var numLocs = Locations.find().count();
        if(numLocs < 2) {
            alert('Please submit at least 2 locations.');
            return;
        }

        /*
            Loop over the locations (front end).
            @Precondition:
                - Set of locations on the HTML is equivalent 
                    to the set of locations in Locations Meteor Collection.
            @Postcondition:
                - "locs" array containing location object.
                - "points" array containing Google Maps LatLng object.
        */
        var locs = [];
        var points = [];
        $(".location-item").each(function() {
            var locationName = $.trim( $(this).text() );
            var location = Locations.findOne({'locationName': locationName});
            locs.push(location);
            points.push(new google.maps.LatLng(
                location.latitude,
                location.longitude
            ));
        });


        /*
            Insert the data into the Paths Meteor Collection.
            Then redirect when finished.
        */
        var currentTime = getDateTime();
        var pathName = document.getElementById("newPath").value;
        
        calculateAndStoreShortestRoute(points, pathName, function() {
            /*
                Clear the locations on the HTML + in Locations Meteor Collection
            */
            $(".location-item").remove();

            /*
                Redirect to /paths
            */
            Router.go('/paths');
            Meteor.call('removeAllLocations');
        });
    }
});


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
function calculateAndStoreShortestRoute(points, pathName, redirectCallback) {
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

            var currentTime = getDateTime();

            var pathObj = {
                'path': shortestPath,
                'pathName': pathName,
                'dateCreated': getDateTime()
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

            calculateShortestRoute(dService,
                                    points[startIndex],
                                    wPts,
                                    points[endIndex],
                                    funcCount);

        }
    }
}

