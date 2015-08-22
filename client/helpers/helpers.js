Template.registerHelper('getSetting', function (setting) {
  return getSetting(setting);
});
Template.registerHelper('geoCodeLoc', function(loc) {
	return Meteor.call("geoCodeLoc", loc);
});

geoCodeLoc = function(loc, callback) {
	var sol = "hm?";
	alert("hi");
	sol = Meteor.call("geoCodeLoc", loc); // does not work for some reason
	Meteor.call("geoCodeLoc", loc, function(err, result) {
		//console.log("call geocodeloc");
			
		if (err) {
			console.log("error status: " + err);
		} else {
			// Session.set('q', data);
			sol = result;
			console.log("eyy");
			console.log(result);
			alert("found " + loc );
			callback(function(){
				return result;
			});
      // return result;
		}
	});
	return sol;
};
