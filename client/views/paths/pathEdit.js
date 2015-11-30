

Template.pathEdit.rendered = function() {
	var locObj;
	for (locObj in this.data.path) {
		console.log(locObj.pathName);
		// Locations.insert(locObj);
	}
	$('.loc-list').sortable({
		stop: function(e, ui) {

			element = ui.item.get(0);
			prev = ui.item.prev().get(0);
			next = ui.item.next().get(0); 

			if( ! prev ) {
				
			} 
			else if ( ! next ) {

			}
			else {

			}
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