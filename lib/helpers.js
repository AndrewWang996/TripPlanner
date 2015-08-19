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