getCurrentRoute = function () {
  return Router.current().route.getName();
};
getSiteUrl = function () {
  return Meteor.absoluteUrl();
};
getSetting = function (setting, defaultSetting) {
  var settings = Settings.find().fetch()[0];

  if (settings && (typeof settings[setting] !== 'undefined'))
    return settings[setting];
  else
    return typeof defaultSetting === 'undefined' ? '' : defaultSetting;
};
sanitize = function (s) {
  if(Meteor.isServer){
    var s = sanitizeHtml(s, {
      allowedTags: [ 
        'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 
        'a', 'ul', 'ol', 'li', 'b', 'i', 'strong', 
        'em', 'strike', 'code', 'hr', 'br', 'pre'
      ]
    });
  }
  return s;
};
stripHTML = function (s) {
  return s.replace(/<(?:.|\n)*?>/gm, '');
};
geoCode = function(loc) {
  alert("hi");
  if(Meteor.isServer) {
    alert("it worked!");
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
  }
};