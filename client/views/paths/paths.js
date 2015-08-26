Template.paths.helpers({
	paths: function() {
		return Paths.find({}, {sort: {'info.date': -1}});
	}
});


Template.paths.rendered = function() {
  setTimeout(function() {
    if(GoogleMaps.loaded()) {
      Paths.find().forEach(function(pathObj) {
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

        GoogleMaps.create({
          name: 'pathItemMap' + mapName,
          element: mapElement,
          options: {
            center: new google.maps.LatLng(avgLat, avgLng),
            zoom: 8
          }
        });
      });
    }
  }, 100);
};


Template.pathItem.onCreated(function() {

  // We can use the `ready` callback to interact with the map API once the map is ready.
  GoogleMaps.ready('pathItemMapEurope Tour', function(map) {

    // Add a marker to the map once it's ready
    var marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance
    });
  });

  //   setTimeout(function() {
  //   var mapObjId = this.$('.map-container').attr('id');
  //   var mapObjName = this.$('.map-container')
  //                       .attr('name')
  //                       .substring("pathItemMap".length);

  //   var pathName = this.$('#pathName').text();

  //   var bounds = new google.maps.LatLngBounds();
  //   alert("number 1" + bounds);
  //   GoogleMaps.ready(mapObjName, function(map) {
  //     console.log("hi");
  //     var pathObj = Paths.findOne({'pathName': pathName});
  //     pathObj.path.forEach(function(location){
  //       var marker = new google.maps.Marker({
  //         position: {
  //           lat: location.latitude,
  //           lng: location.longitude
  //         },
  //         map: map.instance
  //       });

  //       bounds.extend(marker.getPosition());
  //     });

  //     alert("number 2" + bounds);
  //     map.fitBounds(bounds);
  //   });
  // }, 200);
});