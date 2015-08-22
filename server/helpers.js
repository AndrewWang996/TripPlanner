geoCodeLoc = function(loc) {
	var geoCodeProvider = 'google';
	var httpAdapter = 'http';
	var extra = {
	  apiKey: 'AIzaSyDKbfA_lfCc_SLS-HU_T2dHGJhyagXkZXw', // for Mapquest, OpenCage, Google Premier
	  formatter: null         // 'gpx', 'string', ...
	};

	var geo = new GeoCoder();
  var results = geo.geocode(loc);
  if(results.length === 0) {
    return {
      'locationFound': false,
      'locationData': null,
      'numFound': 0
    };
  } else {
    return {
      'locationFound': true,
      'locationData': results[0],
      'numFound': results.length
    };
  }
};