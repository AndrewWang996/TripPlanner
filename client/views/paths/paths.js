
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

                calculateAndDisplayRoute(directionsService, 
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



Template.pathItem.onCreated(function() {
    // none
});
