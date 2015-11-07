

/**
    When the template is rendered, call this function.
    Note: I'm not sure if the template is only rendered once.

    We geocomplete the location search field in the HTML.
    We add a listener to say that when the location is found,
        we set the Session variables to this data.

    Make the locations sortable with jQuery.
*/
Template.locEntry.rendered = function(){

    this.autorun(function () {
        if (GoogleMaps.loaded()) {
            $('#newLocation')
                .geocomplete()
                .bind('geocode:result', function(event, result){
                    if(result) {
                        var loc = result.geometry.location;

                        Session.set('latitude', loc.lat());
                        Session.set('longitude', loc.lng());
                        Session.set('locationName', this.value);
                    } 
                });
        }
    });

    $('#locations').sortable();
};

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

            if(Session.get('latitude') !== undefined) {
                var element = document.getElementById("newLocation");

                /*
                    location object to be inserted into Locations Meteor Collection
                */
                var locObj = {
                    latitude: Session.get('latitude'),
                    longitude: Session.get('longitude'),
                    locationName: Session.get('locationName')
                };

                Locations.insert( locObj );
                // Meteor.call('addPath', locObj, function(error) {
                //     if(error) {
                //         alert(error.reason);
                //     }
                // });

                Session.set('latitude', undefined);
                Session.set('longitude', undefined);
                Session.set('locationName', undefined);
                delete Session.keys.latitude;
                delete Session.keys.longitude;
                delete Session.keys.locationName;

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
            Insert the data into the Paths Meteor Collection
        */
        var currentTime = getDateTime();
        var path = document.getElementById("newPath");
        
        var pathObj = {
            'path': locs,
            'pathName': path.value,
            'dateCreated': currentTime
        };

        Paths.insert(pathObj);

        /*
            Clear the locations on the HTML + in Locations Meteor Collection
        */
        $(".location-item").remove();
        Router.go('/paths');
        Meteor.call('removeAllLocations');
    }
});