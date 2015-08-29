

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
  'click #submitPath': function() {
    var numLocs = Locations.find().count();
    if(numLocs < 2) {
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
        var dist = [];
        var time = [];
        for(var i=0; i<numLocs; i++) {
          dist.push([]);
          time.push([]);
        }
        for(var i=0; i<numLocs; i++) {
          for(var j=0; j<numLocs; j++){
            dist[i][j] = response.rows[i].elements[j].distance.value;
            time[i][j] = response.rows[i].elements[j].duration.value;
          }
        }

        /*
        generate the "essential data" as:
        map[ [start, end] + [visitedIndices] ]
          = minDistance;

        Assume that we begin at location 0
        */
        var map = {};
        map[ "0,0,0" ] = 0;

        for(var numVisited = 1; numVisited < numLocs; numVisited++) {
          var newMap = {};

          for(var keyString in map) {
            if( ! map.hasOwnProperty(keyString) ) {
              continue;
            }
            var key = keyString.split(",").map(function(currentValue) {
              return parseInt(currentValue);
            });
            console.assert(key.length >= 3);

            var start = key[0];
            var end = key[1];
            var visitedIndices = key.slice(2);

            console.assert(visitedIndices.length >= 1);

            var minDistance = map[keyString];
            var visitedIndex2 = 0;
            for(var locIndex = 0; locIndex < numLocs; locIndex++) {
              while(visitedIndex2 < visitedIndices.length 
                 && visitedIndices[visitedIndex2] < locIndex) {
                visitedIndex2 ++;
              }
              
              /* They are equal */
              if(visitedIndices[visitedIndex2] === locIndex) {
                continue;
              }

              var newStart = start;
              var newEnd = locIndex;

              var newVisitedIndices = visitedIndices.slice();
              newVisitedIndices.splice(visitedIndex2, 0, newEnd);
              
              var newDatum = [newStart, newEnd].concat(newVisitedIndices);
              var newDistance = minDistance + dist[end][newEnd];

              if( newMap[newDatum] === undefined ) {
                newMap[newDatum] = newDistance;
              } else if( newDistance < newMap[newDatum] ) {
                newMap[newDatum] = newDistance;
              }
            }
          }

          map = newMap;
        }

      }

      console.log(map);
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

    Router.go('/paths');
  }
});