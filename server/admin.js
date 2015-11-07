Meteor.methods({
	addLocation: function(locObj) {
		var _id = Locations.insert(locObj);
	}
});