

Template.pathEdit.onRendered(function() {
    var template = this;

    template._pathObj = template.data;

	template._path = template._pathObj.path;


	/*
		Attach everything in current Path to DOM
	*/
	template._path.forEach(function(locObj) {
		attachToList(locObj.locationName);
	});


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

                        template._latitude = loc.lat();
                        template._longitude = loc.lng();
                        template._locationName = this.value;
                    }
                });

			var mapElementName = 'pathItemMap' + template._pathObj.pathName;
		    var mapElement = document.getElementById(mapElementName);

		    /*
		        Create map.
		    */
		    template._map = new google.maps.Map(mapElement, {
		        center: calculateCenter(template._pathObj),
		        zoom: 7
		    });

            template._directionsService = new google.maps.DirectionsService;
            template._directionsDisplay = new google.maps.DirectionsRenderer;

		    /*
				Set up map.
		    */
		    setUpMap(template._map,
                     template._directionsService,
                     template._directionsDisplay,
                     template._pathObj);


			$('#loc-list').sortable({
				stop: function(e, ui) {
					displayPathOnDOM(template._path,
                                     template._directionsService,
                                     template._directionsDisplay);
				}
			});
		}
	});
});


/*
	Attach the location to the HTML list

	INPUT PARAMETERS:
		- locationName: String with the name of the location
*/
function attachToList(locationName) {
	var locationList = document.getElementById("loc-list");
	var DOMElement = makeLocationDOM(locationName);
	locationList.appendChild(DOMElement);
}


/*
	Scrapes the DOM for the new path.
	Displays the path on the Google Maps map object.

	INPUT PARAMETERS:
		- path: the global path that contains valuable information about lat / lng
		- directionsService: google.maps.directionsService object (?)
		- directionsDisplay: google.maps.directionsrenderer object (?)
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
	$(".loc-list-item").each(function(i,v) {
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

/*
    Get the index of the element with proper name 'locationName' in path array.
    If not found, return -1

    INPUT PARAMETERS:
        locationName: the name of the location, as a String
        path: the array of locationObjects

    OUTPUT PARAMETERS:
        the index of the locationObject with name 'locationName' in the path array,
            or -1 if not found
*/
function getIndexInPath(locationName, path) {
    for(var i=0; i < path.length; i++) {
        if(path[i].locationName === locationName) {
            return i;
        }
    }
    return -1;
}

/*
    Remove the element with proper name 'name' from path array
 */
function removeFromPath(locationName, path) {
    var indexInPath = getIndexInPath(locationName, path);
    if(indexInPath < 0) {
        throw {
            name: "Invalid Index",
            message: "Location not found in Path while editing Paths",
            toString: function() {
                return name + " : " + message;
            }
        };
    }
    path.splice(indexInPath, 1);

}


/*
	Create and return the HTML element that contains the text locationName

	INPUT PARAMETERS:
		- locationName: the name of the location / can be any text

	OUTPUT PARAMETERS:
		- an HTML element whose innerHTML is the text locationName
*/
function makeLocationDOM(locationName) {
	var newLocationDOM = document.createElement('div');
	newLocationDOM.className = "loc loc-list-item ui-sortable-handle";

	var moveIcon = document.createElement('span');
	moveIcon.className = "fa fa-arrows-v";

	var deleteIcon = document.createElement('span');
	deleteIcon.className = "fa fa-times delete-location pull-right";

	newLocationDOM.appendChild(moveIcon);
	newLocationDOM.innerHTML += " " + locationName;
	newLocationDOM.appendChild(deleteIcon);

	return newLocationDOM;
}


Template.pathEdit.events({

    /**
     * On mouse down on a list item, set the height of the list to static.
     * @param e event
     * @param template current template
     */
    'mousedown .loc-list-item': function(e, template) {
        $('#loc-list').height($('#loc-list').height());
    },
    /**
     * On mouse up, let list height be dynamically controlled again.
     * @param e javascript event
     * @param template current template
     */
    'mouseup .loc-list-item': function(e, template) {
        $('#loc-list').height('auto');
    },

	/**
		Deletes the location in the Path. 
		Also deletes the location from the DOM.
		Display the new path on the Google Maps map object.

        INPUT PARAMETERS:
            e: This is jQuery Event that contains data on the click.
	*/
	"click .delete-location": function(e, template) {
		/*
			Remove the Location object from the global path variable
		*/
        var deleteElement = e.currentTarget;
        var parentElement = deleteElement.parentElement;
        var locationName = parentElement.innerText.trim();

		removeFromPath(locationName, template._path);

		/*
			Remove the location from the DOM.
		*/
		var HTMLNode = e.target.parentNode;
		HTMLNode.parentNode.removeChild(HTMLNode);

		/*
			Display the new path on the Google Maps map object
		*/
		displayPathOnDOM(template._path,
                         template._directionsService,
                         template._directionsDisplay);
	},

	/*
		Store the new Path (which should be an array)
			into the Paths Collection, thereby replacing
			the old Path.
	*/
	"click #editPath": function(e, template) {
		var newPath = getPathFromDOM(template._path);
		Paths._collection.update({_id: template.data._id}, {
			$set: {path: newPath}
		});
		Meteor.call('updatePath', template.data.pathName, newPath);
		Router.go('/paths');
	},

	/*
		When the user presses 'enter' on his keyboard,
			enter in the new location into the temporary array
			of locations.
	*/
	'keyup #newLocationEdit': function(event, template) {
        if(event.keyCode == 13) {

            if(template._latitude !== undefined) {
                var element = document.getElementById("newLocationEdit");

                /*
                    location object to be inserted into Locations Meteor Collection
                */
                var locObj = {
                    latitude: template._latitude,
                    longitude: template._longitude,
                    locationName: template._locationName
                };

                /*
                	Push the Location object into the global path.
                */
                template._path.push(locObj);


                /*
					Insert the location name into the DOM.
                */
                attachToList(locObj.locationName);


                /*
					Display the path that is defined by the DOM.
					Note that the path has not yet been committed to the actual Path
						in the database.
                */
                displayPathOnDOM(template._path,
                                 template._directionsService,
                                 template._directionsDisplay);


                /*
					Delete the session variables
                */
                template._latitude = undefined;
                template._longitude = undefined;
                template._locationName = undefined;

                element.value = "";
                return false;
            }
        }
    }
	
});