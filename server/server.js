

Meteor.startup(function () {

  function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 8,
      center: {lat: -34.397, lng: 150.644}
    });
    var geocoder = new google.maps.Geocoder();

    document.getElementById('submit').addEventListener('click', function() {
      geocodeAddress(geocoder, map);
    });
  }

  function geocodeAddress(geocoder, resultsMap) {
    var address = document.getElementById('address').value;
    geocoder.geocode({'address': address}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        resultsMap.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map: resultsMap,
          position: results[0].geometry.location
        });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }


  var geoCode = function(loc, callback) {
    console.log("1. server geoCodeLoc called with " + loc);
    var geoCodeProvider = 'google';
    var httpAdapter = 'http';
    var extra = {
      apiKey: 'AIzaSyDKbfA_lfCc_SLS-HU_T2dHGJhyagXkZXw', // for Mapquest, OpenCage, Google Premier
      formatter: null         // 'gpx', 'string', ...
    };
    console.log("2. server geoCodeLoc called with " + loc);
    var geo = new GeoCoder();
    var results = geo.geocode(loc);

    console.log("3. server geoCodeLoc called with " + loc);
    if(results.length === 0) {
      console.log("4. a. server geoCodeLoc called with " + loc);
      return {
        'locationFound': false,
        'locationData': null,
        'numFound': 0
      };
    } else {
      console.log("4. b. server geoCodeLoc called with " + loc);
      return {
        'locationFound': true,
        'locationData': results[0],
        'numFound': results.length
      };
    }
  };

  Meteor.methods({
    abc: function() {
      var result = {};
      result.foo = "Hello ";
      result.bar = "World!";
      return result;
    },
    geoCodeLoc: function(loc) {
      var result = geoCode(loc);
      console.log("geoCode result computed");
      return result;
    }
  });
  var result = Meteor.call('geoCodeLoc', '1362 oak knoll dr, san jose, ca');
  console.log(result);
  // var geoCodeProvider = 'google';
  // var httpAdapter = 'http';
  // var extra = {
  //   apiKey: 'AIzaSyDKbfA_lfCc_SLS-HU_T2dHGJhyagXkZXw', // for Mapquest, OpenCage, Google Premier
  //   formatter: null         // 'gpx', 'string', ...
  // };

  // var geo = new GeoCoder();
  // var result = geo.geocode('29 champs elysée paris');
  // console.log(result);
  // console.log(geo.geocode('paris'));


  /*
    Code causes database to be cleared on restart
  */
  // var globalObject=Meteor.isClient?window:global;
  // for(var property in globalObject){
  //   var object=globalObject[property];
  //   if(object instanceof Meteor.Collection){
  //       object.remove({});
  //   }
  // }
});