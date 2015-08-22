Template.registerHelper('getSetting', function (setting) {
  return getSetting(setting);
});
Template.registerHelper('geoCodeLoc', function(loc) {
	return Meteor.call("geoCodeLoc", loc);
});

geoCodeLoc = function(loc, callback) {
	var sol = "hm?";
	// sol = Meteor.call("geoCodeLoc", loc); // does not work for some reason
	Meteor.call("geoCodeLoc", loc, function(err, result) {
		//console.log("call geocodeloc");
			
		if (err) {
			console.log("error status: " + err);
		} else {
			// Session.set('q', data);
			console.log("eyy");
			console.log(result);
			// var location = result;
			// console.log(location.numFound);
			// console.log(result.numFound);
			alert("found " + loc );

      return result;
		}
	});
};
