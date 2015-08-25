
if(Meteor.isClient){
  Meteor.startup( function(){
    GoogleMaps.load({
      key: 'AIzaSyCLPZ7L1MROZUEP4w-5dbKYnyIrcyM6fV4',
      libraries: 'places'
    });
  });

  Template.locEntry.rendered = function(){
    this.autorun(function () {
      // Wait for API to be loaded
      if (GoogleMaps.loaded()) {

        // Example 1 - Autocomplete only
        $('#newLocation').geocomplete({
          map: $("#map")
        });
      }
    });

    $('#locations').sortable();
  };
}

Template.locEntry.helpers({
  allLocations: function() {
    return Locations.find({}, {sort: {rank: 1}});
  }
});


Template.locEntry.events({

  /*
  Determines what happens after form data / Path is submitted.
  Needs serious fixing.
  Internet seems to indicate that ranking system is necessary,
  although changing the Locations collection after submitting seems
  to be better choice than manipulating collection during sorting.
  */
  'keydown #newLocation': function(event, template) {
    if(event.keyCode == 13) {
      var element = document.getElementById("newLocation");

      var locObj = {};
      var index = Locations.find().count();
      locObj.rank = index;
      locObj.idnum = "id" + index.toString();
      locObj.title = element.value;

      Locations.insert( locObj );


      // alert(Locations.find().count());
      element.value = "";
      return false;
    }
  },
  'click #submitPath': function(event, template) {
    var locs = [];
    $(".location-item").each(function() {
      var locationName = $.trim( $(this).text() );
      locs.push(locationName);
    });
    console.log(locs);
    var path = document.getElementById("newPath");
    Paths.insert({
      'path': locs,
      'name': path.value
    });
    // Router.route('/paths');
  }
});