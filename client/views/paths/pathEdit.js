
// not sure if using global variables here is a good idea.
// even if the span of it is only within this file.
var pathObj;
var path;
var directionsService;
var directionsDisplay;

Template.pathEdit.onRendered(function() {
	pathObj = this.data;
	path = pathObj.path;

	Tracker.autorun(function() {
		if(GoogleMaps.loaded()) {

			/*
				Geocode entries in the text field with id "editPath".
			*/
			$('#newLocationEdit')
                .geocomplete()
                .bind('geocode:result', function(event, result){
                    if(result) {
                        var loc = result.geometry.location;

                        Session.set('latitude', loc.lat());
                        Session.set('longitude', loc.lng());
                        Session.set('locationName', this.value);
                    }
                });

			var mapElementName = 'pathItemMap' + pathObj.pathName;
		    var mapElement = document.getElementById(mapElementName);

		    /*
		        Create map.
		    */
		    map = new google.maps.Map(mapElement, {
		        center: calculateCenter(pathObj),
		        zoom: 7
		    });

		    directionsService = new google.maps.DirectionsService;
		    directionsDisplay = new google.maps.DirectionsRenderer;

		    /*
				Set up map.
		    */
		    setUpMap(map, directionsService, directionsDisplay, pathObj); 


			$('#loc-list').sortable({
				stop: function(e, ui) {
					displayPathOnDOM(path, directionsService, directionsDisplay);
				}
			});
		}
	});
});



/*
	Scrapes the DOM for the new path.
	Displays the path on the Google Maps map object.

	INPUT PARAMETERS:
		path: the global path that contains valuable information about lat / lng
		directionsService: google.maps.directionsService object (?)
		directionsDisplay: google.maps.directionsrenderer object (?)
*/
function displayPathOnDOM(path, directionsService, directionsDisplay) {
	var newPath = getPathFromDOM(path);
	var newPoints = pathToPoints(newPath);
	calculateAndDisplayRoute(directionsService, 
							directionsDisplay, 
							newPoints);
}

/*
	Scrapes the DOM for the names of the locations.
	Then searches the current Path for the actual Location objects.
	Then inserts a deep copy of the Location Object into an array called newPath.
	Returns the array.

	INPUT PARAMETERS:
		path: the current Path

	OUTPUT PARAMETERS:
		the new Path, as defined in the DOM.
*/
function getPathFromDOM(path) {
	var newPath = [];
	$(".new-loc").each(function(i,v) {
		var locationName = $.trim(v.textContent);
		for(var i=0; i<path.length; i++) {
			var locObj = path[i];
			if(locObj.locationName === locationName) {
				var locObjCopy = jQuery.extend(true, {}, locObj);
				newPath.push(locObjCopy);
				break;
			}
		}
	});
	return newPath;
}


Template.pathEdit.events({
	/**
		Deletes the location in the Path. 
		Also deletes the location from the DOM.
		Display the new path on the Google Maps map object.
	*/
	"click #deleteLocation": function(e) {
		/*
			Remove the Location object from the global path variable
		*/
		var locObj = this; 
			// I don't know why, but 'this' refers to the actual Location object.
		var index = path.indexOf(locObj);
		console.log(index);
		path.splice(index, 1);

		/*
			Remove the location from the DOM.
		*/
		var HTMLNode = e.target.parentNode;
		HTMLNode.parentNode.removeChild(HTMLNode);

		/*
			Display the new path on the Google Maps map object
		*/
		displayPathOnDOM(path, directionsService, directionsDisplay);
	},

	/*
		Store the new Path (which should be an array)
			into the Paths Collection, thereby replacing
			the old Path.
	*/
	"click #editPath": function() {
		var newPath = getPathFromDOM(path);
		Meteor.call('updatePath', pathObj.pathName, newPath);
		Router.go('/paths');
	},

	/*
		When the user presses 'enter' on his keyboard,
			enter in the new location into the temporary array
			of locations.
	*/
	'keyup #newLocationEdit': function(event, template) {
        if(event.keyCode == 13) {

            if(Session.get('latitude') !== undefined) {
                var element = document.getElementById("newLocationEdit");

                /*
                    location object to be inserted into Locations Meteor Collection
                */
                var locObj = {
                    latitude: Session.get('latitude'),
                    longitude: Session.get('longitude'),
                    locationName: Session.get('locationName')
                };

                /*
                	Push the Location object into the global path.
                */
                path.push(locObj);


                /*
					Insert the location name into the DOM.
                */
                var DOMLocList = document.getElementById("loc-list");
                var DOMFirstLoc = DOMLocList.children[0];
                var DOMLocCopy = DOMFirstLoc.cloneNode(true);
                DOMLocCopy.textContent = locObj.locationName;
                DOMLocList.appendChild(DOMLocCopy);

                /*
					Display the path that is defined by the DOM.
					Note that the path has not yet been committed to the actual Path
						in the database.
                */
                displayPathOnDOM(path, directionsService, directionsDisplay);

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
    }
	
});