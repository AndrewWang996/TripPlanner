LocationSchema = new SimpleSchema({
	_id: {
		type: String,
		optional: true,
		label: "Unique ID Number"
	},
	latitude: {
		type: Number,
		decimal: true,
		label: "Latitude of location"
	},
	longitude: {
		type: Number,
		decimal: true,
		label: "Longitude of location"
	},
	locationName: {
		type: String,
		label: "Name of location",
		min: 1
	}
});

Locations = new Mongo.Collection("locations");
Locations.attachSchema(LocationSchema);

// Locations.allow({
// 	insert: function() {return true;},
// 	remove: function() {return true;} 
// 	// anybody can insert and remove from Locations Meteor Collection
// });

/*

Location object:
{
	latitude: float,
	longitude: float,
	locationName: string
}

*/