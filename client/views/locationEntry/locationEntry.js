

Template.locEntry.rendered = function(){
    this.autorun(function () {
        if (GoogleMaps.loaded()) {
            $('#newLocation')
                .geocomplete()
                .bind('geocode:result', function(event, result){
                    if(result) {
                        var loc = result.geometry.location;
                        // console.log(loc.lat(), loc.lng(), this.value);
                        Session.set('latitude', loc.lat());
                        Session.set('longitude', loc.lng());
                        Session.set('locationName', this.value);
                        // Session.set('locationName', result.formatted_address);
                        // this.value = "";
                    } 
                });
        }
    });
    $('#locations').sortable();
};

Template.locEntry.helpers({
  allLocations: function() {
    return Locations.find();
  }
});


Template.locEntry.events({

    /*
      Determines what happens after form data / Path is submitted.
      Needs serious fixing.
      Internet seems to indicate that ranking system is necessary,
      although changing the Locations collection after submitting seems
      to be better choice than manipulating collection during sorting.
    */
    'keyup #newLocation': function(event, template) {
        if(event.keyCode == 13) {

      /*
      Wait a small amount of time (0.5 seconds)
        so that 'geocomplete' can finish.

      Crude method...
      I will replace with callbacks when I understand them.

      BUG: Unless you wait about 2 seconds,
              the location entered may be incorrect:
                - previous submit
                - blank (if no previous submit)
      */
            if(Session.get('latitude') !== undefined) {
                var element = document.getElementById("newLocation");

                var locObj = {
                    latitude: Session.get('latitude'),
                    longitude: Session.get('longitude'),
                    locationName: Session.get('locationName')
                };

                Locations.insert( locObj );

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
            - Paths Meteor Collections must have new path.

    */
    'click #submitPath': function() {
        var numLocs = Locations.find().count();
        if(numLocs < 2) {
            alert('Please submit at least 2 locations.');
            return;
        }

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


        var currentTime = getDateTime();
        var path = document.getElementById("newPath");

        Paths.insert({
            'path': locs,
            'pathName': path.value,
            'dateCreated': currentTime
        });

        $(".location-item").remove();
 
        Router.go('/paths');
        Meteor.call('removeAllLocations');
    }
});