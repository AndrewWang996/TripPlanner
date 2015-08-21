Template.paths.helpers({
	paths: function() {
		return Paths.find({}, {sort: {'info.date': -1}});
	}
});