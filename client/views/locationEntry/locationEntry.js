
if(Meteor.isClient){
  Meteor.startup( function(){
    GoogleMaps.load({
      key: 'AIzaSyCLPZ7L1MROZUEP4w-5dbKYnyIrcyM6fV4',
      libraries: 'places'
    });
  });
}

Template.locEntry.rendered = function(){
  this.autorun(function () {
    if (GoogleMaps.loaded()) {
      $('#newLocation')
              .geocomplete()
              .bind('geocode:result', function(event, result){
        var loc = result.geometry.location;

        Session.set('latitude', loc.lat());
        Session.set('longitude', loc.lng());
        Session.set('locationName', this.value);
        // Session.set('locationName', result.formatted_address);
        // this.value = "";
      });
    }
  });

  $('#locations').sortable();
};

Template.locEntry.helpers({
  allLocations: function() {
    return Locations.find({}, {sort: {rank: 1}});
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
  'keydown #newLocation': function(event, template) {
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
      setTimeout(function(){
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
      }, 200);
    }
  },
  'click #submitPath': function(event, template) {
    if(Locations.find().count() < 2) {
      alert('Please submit at least 2 locations.');
      return;
    } 

    var locs = [];
    var distanceMatrixPoints = [];
    $(".location-item").each(function() {
      var locationName = $.trim( $(this).text() );
      var location = Locations.findOne({'locationName': locationName});
      locs.push(location);
      distanceMatrixPoints.push({
        lat: location.latitude,
        lng: location.longitude
      })
    });

    var service = new google.maps.DistanceMatrixService;
    service.getDistanceMatrix({
      origins: distanceMatrixPoints,
      destinations: distanceMatrixPoints,
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false
    }, function(response, status) {
      if (status !== google.maps.DistanceMatrixStatus.OK) {
        alert('Error was: ' + status);
      } 
      else { 
        console.log(response);
      }
    });

    $(".location-item").remove();
    Meteor.call('removeAllLocations');

    var currentTime = getDateTime();
    var path = document.getElementById("newPath");
    
    Paths.insert({
      'path': locs,
      'pathName': path.value,
      'dateCreated': currentTime
    });

    alert("hello");
    Router.go('/paths');
    alert("it has run");
  }
});