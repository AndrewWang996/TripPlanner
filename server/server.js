
Meteor.startup(function () {

  /*
  var geocoderProvider = 'google';
  var httpAdapter = 'https';
  // optionnal 
  var extra = {
      // apiKey: helpers.getSettings('GOOGLE_API_KEY'),
      apiKey: 'AIzaSyDKbfA_lfCc_SLS-HU_T2dHGJhyagXkZXw', // for Mapquest, OpenCage, Google Premier 
      formatter: null         // 'gpx', 'string', ... 
  };
  var GoogleGeoCoder = Meteor.npmRequire('node-geocoder');
  var geocoder = GoogleGeoCoder(geocoderProvider, httpAdapter, extra);

  Meteor.methods({
    geoCodeLoc: function(loc) {
      console.log("1. server geoCodeLoc called with " + loc);

      Future = Npm.require('fibers/future');
      var myFuture = new Future();

      geocoder.geocode(loc, function(err, res) {
        if(err) {
          myFuture.throw(err);
        } else {
          myFuture.return(res);
        }
      });

      var results = myFuture.wait();

      if(results.length === 0) {
        console.log("2. a. server geoCodeLoc called with " + loc);
        return {
          'locationFound': false,
          'locationData': null,
          'numFound': 0
        };
      } else {
        console.log("2. b. server geoCodeLoc called with " + loc);
        return {
          'locationFound': true,
          'locationData': results[0],
          'numFound': results.length
        };
      }
    }
  });

  var result = Meteor.call('geoCodeLoc', '1362 Oak Knoll Dr, San Jose, CA');
  console.log(result);
  */

//  var geoCodeProvider = 'google';
//  var httpAdapter = 'http';
//  var extra = {
//    apiKey: 'AIzaSyDKbfA_lfCc_SLS-HU_T2dHGJhyagXkZXw', // for Mapquest, OpenCage, Google Premier
////    formatter: null         // 'gpx', 'string', ...
//  };

//  var geo = new GeoCoder();
 //  var result = geo.geocode('29 champs elysée paris');
  // console.log(result);
   //console.log(geo.geocode('paris'));


  /*
    Code causes database to be cleared on server restart
  */
  // var globalObject=Meteor.isClient?window:global;
  // for(var property in globalObject){
  //   var object=globalObject[property];
  //   if(object instanceof Meteor.Collection){
  //       object.remove({});
  //   }
  // }

  /*
    Code causes only Paths collection to be cleared on server restart
  */
  // Paths.remove({});
});
