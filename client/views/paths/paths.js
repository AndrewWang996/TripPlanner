
Template.pathsHeader.events({
  'click #removeAllPaths': function(event, template){
    Meteor.call('removeAllPaths');
  }
});


Template.paths.helpers({
	paths: function() {
		// return Paths.find({}, {sort: {'info.date': 1}});
    return Paths.find({}, {sort: {'dateCreated': -1}});
    // return Paths.find({}, {sort: {date: 1, time: 1}});
  }
});

Template.paths.rendered = function() {
  setTimeout(function() {
    if(GoogleMaps.loaded()) {
      Paths.find().forEach(function(pathObj) {

        var pathLength = pathObj.path.length;

        /*
        Calculate marker locations (should be sync code)
        */
        var sumLat = 0;
        var sumLng = 0;
        pathObj.path.forEach(function(location){
          sumLat += location.latitude;
          sumLng += location.longitude;
        });
        var avgLat = sumLat / pathObj.path.length;
        var avgLng = sumLng / pathObj.path.length;

        var mapName = 'pathItemMap' + pathObj.pathName;
        var elementName = 'pathItemMap' + pathObj.pathName;
        var mapElement = document.getElementById(elementName);

        /*
        Place markers (maybe async?)
        */
        map = new google.maps.Map(mapElement, {
          center: new google.maps.LatLng(avgLat, avgLng),
          zoom: 7
        });
        
        var bounds = new google.maps.LatLngBounds();

        pathObj.path.forEach(function(location){
          var position = new google.maps.LatLng(location.latitude, location.longitude);
          createMarker(map, position);

          bounds.extend(position);
        });

        map.fitBounds(bounds);

        /*
        Calculate and show directions (async code)
        */
        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
        directionsDisplay.setMap(map);

        function calculateAndDisplayRoute(start, wayPts, end) {
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
        var LatLngStart = new google.maps.LatLng(
          pathObj.path[0].latitude,
          pathObj.path[0].longitude
        );
        var LatLngEnd = new google.maps.LatLng(
          pathObj.path[pathLength - 1].latitude,
          pathObj.path[pathLength - 1].longitude
        );
        var wayPoints = [];
        for(var i=1; i < pathLength - 1; i++){
          wayPoints.push({
            location: new google.maps.LatLng(
              pathObj.path[i].latitude,
              pathObj.path[i].longitude
            ), 
            stopover: true
          });
        }
        console.log(LatLngStart);
        console.log(LatLngEnd);
        console.log(wayPoints);

        calculateAndDisplayRoute(LatLngStart, wayPoints, LatLngEnd);
      
      });
    }
  }, 100);
};


Template.pathItem.onCreated(function() {

  // We can use the `ready` callback to interact with the map API once the map is ready.
  // GoogleMaps.ready('pathItemMapEurope Tour', function(map) {

  //   // Add a marker to the map once it's ready
  //   var marker = new google.maps.Marker({
  //     position: map.options.center,
  //     map: map.instance
  //   });
  // });
});
