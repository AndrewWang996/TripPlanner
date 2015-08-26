createMarker = function(map, point, name) {
	if(name === undefined) {
		var marker = new google.maps.Marker({
			position: point,
			map: map
		});
	}
	else {
		var marker = new google.maps.Marker({
	    position: point,
	    map: map,
	    title: name
	  });
	}
}