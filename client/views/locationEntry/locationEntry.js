var helpers = GLOBAL.helpers;
var MapHelpers = GLOBAL.MapHelpers;




Template.locEntry.onCreated(function() {
    var template = this;

    template._locations = new ReactiveVar([]);
});

/**
    Upon render:

    We geocomplete the location search field in the HTML.
    We add a listener to say that when the location is found,
        we set the Session variables to this data.

    Make the locations sortable with jQuery.
*/
Template.locEntry.onRendered(function() {

    var template = this;

    // Meteor.call('removeAllLocations');

    this.autorun(function () {
        if (GoogleMaps.loaded()) {
            $('#newLocation')
                .geocomplete()
                .bind('geocode:result', function(event, result){
                    if(result) {
                        var loc = result.geometry.location;

                        template._latitude = loc.lat();
                        template._longitude = loc.lng();
                        template._locationName = this.value;
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
        return Template.instance()._locations.get();
        // return Locations.find();
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
    'keyup #newLocation': function(e, template) {
        if(e.keyCode == 13) {

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

                // Locations.insert( locObj );
                var _locations = template._locations.get();
                _locations.push(locObj);
                template._locations.set( _locations );

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
    'click #deleteLocation': function(e, template) {
        var locName = this.locationName;
        var _locations = template._locations.get();
        for(var i=0; i<_locations.length; i++) {
            if(_locations[i].locationName === locName) {
                _locations.splice(i, 1);
                template._locations.set(_locations);
                break;
            }
        }
    },

    /**
        After clicking the "Create Path" button, create the path.

        @Precondition:
            - There must be at least 2 locations.
        @Postcondition:
            - Locations Meteor Collection is emptied.
            - Paths Meteor Collections adds the new Path.
    */
    'click #submitPath': function(e, template) {

        /*
            Check that there are at least 2 locations.
        */
        // var numLocs = Locations.find().count();
        var numLocs = template._locations.length;
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
        $(".loc-potential").each(function() {
            var locationName = $.trim( $(this).text() );
            var _locations = template._locations.get();
            var location = null;
            for(var i=0; i<_locations.length; i++) {
                if(_locations[i].locationName === locationName) {
                    location = _locations[i];
                }
            }
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
        var pathName = document.getElementById("newPath").value;
        
        MapHelpers.calculateAndStoreShortestRoute(points, pathName, function() {
            /*
                Clear the locations on the HTML + in Locations Meteor Collection
            */
            $(".loc-potential").remove();

            /*
                Redirect to /paths
            */
            Router.go('/paths');
            // Meteor.call('removeAllLocations');
            template._locations.set([]);
        });
    }
});