

Template.locEntry.rendered = function(){
  this.autorun(function () {
    if (GoogleMaps.loaded()) {
      $('#newLocation')
              .geocomplete()
              .bind('geocode:result', function(event, result){
        if(result) {
          var loc = result.geometry.location;
          console.log(loc.lat(), loc.lng(), this.value);
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

    var directionsService = new google.maps.DirectionsService;

    function calculateRoute(start, wayPts, end) {
      directionsService.route({
        origin: start,
        destination: end,
        waypoints: wayPts,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING
      }, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
    }

    for(var i=0; i<numLocs; i++) {
      for(var j=i+1; j<numLocs; j++) {
        var wayPoints = [];
        for(var k=0; k<numLocs; k++) {
          if(k !== i && k !== j) {
            wayPoints.push(points[k]);
          }
        }
        calculateRoute(points[i], wayPoints, points[j]);
      }
    }


    // var pathOrder = null;

    // var service = new google.maps.DistanceMatrixService;
    // service.getDistanceMatrix({
    //   origins: distanceMatrixPoints,
    //   destinations: distanceMatrixPoints,
    //   travelMode: google.maps.TravelMode.DRIVING,
    //   unitSystem: google.maps.UnitSystem.METRIC,
    //   avoidHighways: false,
    //   avoidTolls: false
    // }, function(response, status) {
    //   if (status !== google.maps.DistanceMatrixStatus.OK) {
    //     alert('Error was: ' + status);
    //   } 
    //   else {
    //     var dist = [];
    //     var time = [];
    //     for(var i=0; i<numLocs; i++) {
    //       dist.push([]);
    //       time.push([]);
    //     }
    //     for(var i=0; i<numLocs; i++) {
    //       for(var j=0; j<numLocs; j++){
    //         dist[i][j] = response.rows[i].elements[j].distance.value;
    //         time[i][j] = response.rows[i].elements[j].duration.value;
    //       }
    //     }

    //     /*
    //     generate the "essential data" as:
    //     map[ [start, end] + [visitedIndices] ]
    //       = minDistance;

    //     Assume that we begin at location 0
    //     */
    //     var map = {};
    //     map[ "0,0,0" ] = 0;

    //     for(var numVisited = 1; numVisited < numLocs; numVisited++) {
    //       var newMap = {};

    //       for(var keyString in map) {
    //         if( ! map.hasOwnProperty(keyString) ) {
    //           continue;
    //         }
    //         var key = keyString.split(",").map(function(currentValue) {
    //           return parseInt(currentValue);
    //         });
    //         console.assert(key.length >= 3);

    //         var start = key[0];
    //         var end = key[1];
    //         var visitedIndices = key.slice(2);

    //         console.assert(visitedIndices.length >= 1);

    //         var minDistance = map[keyString];
    //         for(var locIndex = 0; locIndex < numLocs; locIndex++) {

    //            locIndex already visited 
    //           if(visitedIndices.indexOf(locIndex) >= 0) {
    //             continue;
    //           }

    //           var newStart = start;
    //           var newEnd = locIndex;

    //           var newVisitedIndices = visitedIndices.slice();
    //           newVisitedIndices.push(newEnd);
              
    //           var newDatum = [newStart, newEnd].concat(newVisitedIndices);
    //           var newMinDistance = minDistance + dist[end][newEnd];

    //           if( newMap[newDatum] === undefined ) {
    //             newMap[newDatum] = newMinDistance;
    //           } else if( newDistance < newMap[newDatum] ) {
    //             newMap[newDatum] = newMinDistance;
    //           }
    //         }
    //       }

    //       map = newMap;
    //     }
    //   }


    //   /* Determine which of the routes in the map is the fastest */
    //   var LkeyString = null;
    //   var LminDistance = null;

    //   for(var keyString in map) {
    //     if( ! map.hasOwnProperty(keyString) ) {
    //       continue;
    //     }
    //     if(LkeyString === null) {
    //       LkeyString = keyString;
    //       LminDistance = map[keyString];
    //     } else if(map[keyString] < LminDistance){
    //       LminDistance = map[keyString];
    //       LkeyString = keyString;
    //     }
    //   }

    //   var keyData = LkeyString.split(",").map(function(currentValue) {
    //     return parseInt(currentValue);
    //   });

    //   // pathOrder was defined earlier, before the distanceMatrix calculations
    //   pathOrder = keyData.slice(2);

    //   var currentTime = getDateTime();
    //   var path = document.getElementById("newPath");

    //   Paths.insert({
    //     'path': locs,
    //     'pathName': path.value,
    //     'pathOrder': pathOrder,
    //     'dateCreated': currentTime
    //   });

    //   $(".location-item").remove();

    //   Router.go('/paths');
    // });

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