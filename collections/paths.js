PathSchema = new SimpleSchema({
	_id: {
		type: String,
		optional: true,
		label: "Unique ID Number"
	},
	path: {
		type: [LocationSchema],
		label: "JSON map of Locations, as defined in the Locations Meteor Collection"
	},
	pathName: {
		type: String,
		label: "Name of Path",
		min: 1
	},
	dateCreated: {
		type: Date,
		label: "Date of Creation / Entry"
	}
});

Paths = new Mongo.Collection("paths");
Paths.attachSchema(PathSchema);

