   
Meteor.startup(function () {
GoogleMaps.load({
      key: 'AIzaSyCLPZ7L1MROZUEP4w-5dbKYnyIrcyM6fV4',
      libraries: 'places'
    });





  var geo = new GeoCoder();
  var result = geo.geocode('29 champs elysée paris');
  console.log(result);
  console.log(geo.geocode('paris'));
  alert ('in client');

});
