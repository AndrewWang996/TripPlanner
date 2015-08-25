Template.paths.helpers({
	paths: function() {
		return Paths.find({}, {sort: {'info.date': -1}});
	}
});

Template.pathItem.helpers({
  exampleMapOptions: function(path) {
    
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      // Map initialization options
      var sumLat = 0;
      var sumLng = 0;
      for each (var location in path) {
        sumLat += location.latitude;
        sumLat += location.longitude;
      }
      var avgLat = sumLat / this.path.length;
      var avgLng = sumLng / this.path.length;
      return {
        center: new google.maps.LatLng(avgLat , avgLng),
        zoom: 8
      };
    }
  }
});

Template.pathItem.onCreated(function() {
  // We can use the `ready` callback to interact with the map API once the map is ready.
  GoogleMaps.ready('exampleMap', function(map) {

    // Add a marker to the map once it's ready
    var marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance
    });
  });
});