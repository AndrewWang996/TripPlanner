Template.paths.helpers({
	paths: function() {
		return Paths.find({}, {sort: {'info.date': -1}});
	}
});

Template.pathItem.helpers({
  exampleMapOptions: function() {
    
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      // Map initialization options
      return {
        center: new google.maps.LatLng(-37.8136, 144.9631),
        zoom: 8
      };
    }
  }
});

// Template.pathItem.rendered = function () {

//   this.autorun(function () {
//     // Wait for API to be loaded
//     if (GoogleMaps.loaded()) {

//       // Example 1 - Autocomplete only
//       $('#place1').geocomplete();

//       // Example 2 - Autocomplete + map
//       $('#place2').geocomplete({
//         map: $("#map")
//       });

//       // Example 3 - Autocomplete + map + form
//       $('#place3').geocomplete({
//         map: "#map2",
//         details: "form"
//       });

//     }
//   });

// }

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