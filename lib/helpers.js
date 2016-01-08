GLOBAL.helpers = {

    /*
        Gets the exact time down to the seconds.
        Can be sorted chronologically
     */
    getDateTime: function() {
        var now     = new Date();
        var year    = now.getFullYear();
        var month   = now.getMonth()+1;
        var day     = now.getDate();
        var hour    = now.getHours();
        var minute  = now.getMinutes();
        var second  = now.getSeconds();

        if(month.toString().length == 1) {
            month = '0'+month;
        }
        if(day.toString().length == 1) {
            day = '0'+day;
        }
        if(hour.toString().length == 1) {
            hour = '0'+hour;
        }
        if(minute.toString().length == 1) {
            minute = '0'+minute;
        }
        if(second.toString().length == 1) {
            second = '0'+second;
        }
        var dateTime = year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;
        return dateTime;
    }
};

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

/*
sanitize = function (s) {
    if(Meteor.isServer){
        s = sanitizeHtml(s, {
            allowedTags: [
                'h3', 'h4', 'h5', 'h6', 'blockquote', 'p',
                'a', 'ul', 'ol', 'li', 'b', 'i', 'strong',
                'em', 'strike', 'code', 'hr', 'br', 'pre'
            ]
        });
    }
    return s;
};
*/

stripHTML = function (s) {
    return s.replace(/<(?:.|\n)*?>/gm, '');
};