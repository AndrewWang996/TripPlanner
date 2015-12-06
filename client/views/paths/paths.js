
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
        if(GoogleMaps.loaded()) {
            Paths.find().forEach(function(pathObj) {

                var mapElementName = 'pathItemMap' + pathObj.pathName;
                var mapElement = document.getElementById(mapElementName);

                /*
                    Create map.
                    Recenter map around center of locations in pathObj

                    Place markers (maybe async?)
                */
                map = new google.maps.Map(mapElement, {
                    center: calculateCenter(pathObj),
                    zoom: 7
                });
                
                setUpMap(map, pathObj);
            });
        }
    });
};



Template.pathItem.onCreated(function() {
    // none
});
