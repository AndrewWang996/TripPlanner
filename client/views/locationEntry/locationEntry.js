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
  'click button': function(event, template) {
    alert("hello");
  }
});

Template.locEntry.rendered = function(){
  $('#locations').sortable({
    stop: function(e, ui) {
      var newRank = null;
      var element = ui.item.get(0);
      var prev = ui.item.prev().get(0);
      var next = ui.item.next().get(0);
      if(!prev) {
        newRank = Blaze.getData(next).rank - 1;
      } else if(!next) {
        newRank = Blaze.getData(prev).rank + 1;
      } else {
        var previous = Blaze.getData(element).rank
        var a = Blaze.getData(next).rank
        var b = Blaze.getData(prev).rank
        if(previous > a || previous < b) {
          newRank = (a + b)/2
        }
      }
      if(newRank) {
        Locations.update({_id: Blaze.getData(element)._id}, {$set: {rank: newRank}});
      }
    }
  });
};
