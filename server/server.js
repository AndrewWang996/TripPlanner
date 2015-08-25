
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


  // Locations.remove({});
});
