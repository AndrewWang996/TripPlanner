// // counter starts at 0
// Session.setDefault('counter', 0);

// Template.hello.helpers({
//   counter: function () {
//     return Session.get('counter');
//   }
// });

// Template.hello.events({
//   'click button': function () {
//     // increment the counter when button is clicked
//     Session.set('counter', Session.get('counter') + 1);
//   }
// });


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
      locs.push($(this).text());
    });
    var path = document.getElementById("newPath");
    Paths.insert({
      'path': locs,
      'name': path.value
    });
  }
});

Template.locEntry.rendered = function(){
  $('#locations').sortable();
};
