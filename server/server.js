

Meteor.startup(function () {

  var geoCodeProvider = 'google';
  var httpAdapter = 'http';
  var extra = {
    apiKey: 'AIzaSyDKbfA_lfCc_SLS-HU_T2dHGJhyagXkZXw', // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
  };

  var geo = new GeoCoder();
  var result = geo.geocode('29 champs elysée paris');
  console.log(result);
  console.log(geo.geocode('paris'));

  Meteor.startup(function(){
    var globalObject=Meteor.isClient?window:global;
    for(var property in globalObject){
        var object=globalObject[property];
        if(object instanceof Meteor.Collection){
            object.remove({});
        }
    }
  });
});