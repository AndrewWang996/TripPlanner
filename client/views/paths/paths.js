var MapHelpers = GLOBAL.MapHelpers;

Template.pathsHeader.events({
    /**
        Remove all paths in Paths Metor Collection
        Also reactively removes all paths from the HTML
    */
    'click #removeAllPaths': function(e, template){
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
Template.paths.onRendered(function() {
    Tracker.autorun(function() {
        if(GoogleMaps.loaded()) {
            Paths.find().forEach(function(pathObj) {

                var mapElementName = 'pathItemMap' + pathObj.pathName;
                var mapElement = document.getElementById(mapElementName);

                console.log(pathObj.pathName);
                console.log(mapElementName);
                console.log(mapElement);

                /*
                    Create map.
                    Recenter map around center of locations in pathObj

                    Place markers (maybe async?)
                */
                var map = new google.maps.Map(mapElement, {
                    center: MapHelpers.calculateCenter(pathObj),
                    zoom: 7
                });

                var directionsService = new google.maps.DirectionsService;
                var directionsDisplay = new google.maps.DirectionsRenderer;
                
                MapHelpers.setUpMap(map, directionsService, directionsDisplay, pathObj);
            });
        }
    });
});