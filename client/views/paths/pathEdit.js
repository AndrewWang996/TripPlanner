

Template.pathEdit.rendered = function() {
	var pathObj = this.data;

	Tracker.autorun(function() {
		if(GoogleMaps.loaded()) {

			var mapElementName = 'pathItemMap' + pathObj.pathName;
		    var mapElement = document.getElementById(mapElementName);

		    /*
		        Create map.
		    */
		    map = new google.maps.Map(mapElement, {
		        center: calculateCenter(pathObj),
		        zoom: 7
		    });

		    /*
				Set up map.
		    */
		    setUpMap(map, pathObj); 


		    var path = pathObj.path;

			$('.loc-list').sortable({
				stop: function(e, ui) {

					var element = ui.item;

					var locName = $.trim(element[0].textContent);
					var oldIndex;
					for(oldIndex = 0; oldIndex < path.length; oldIndex ++) {
						var pathLocationName = path[oldIndex].locationName;
						if(pathLocationName === locName) {
							break;
						}
					}

					var newIndex = 0;
					var prev = element.prev();
					while( prev[0] ) {
						newIndex++;
						prev = prev.prev();
					}

					path.splice(newIndex, 0, path[oldIndex]);
					if(oldIndex < newIndex) {
						path.splice(oldIndex, 1);
					}
					else {
						path.splice(oldIndex + 1, 1);
					}

					Meteor.call('updatePath', pathObj.pathName, path);
				}
			});
		}
	});
}

Template.pathEdit.events({
	/*
		Store the new Path (which should be an array)
			into the Paths Collection, thereby replacing
			the old Path.
	*/
	"click #editPath": function() {

	},

	/*
		When the user presses 'enter' on his keyboard,
			enter in the new location into the temporary array
			of locations.
	*/
	'keyup #newLocation': function(event, template) {
        if(event.keyCode == 13) {

        }
    }
});