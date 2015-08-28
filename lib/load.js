if(Meteor.isClient){
  Meteor.startup( function(){
    GoogleMaps.load({
      key: 'AIzaSyCLPZ7L1MROZUEP4w-5dbKYnyIrcyM6fV4',
      libraries: 'places'
    });
  });
}