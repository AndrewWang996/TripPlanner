
Meteor.publish('allPaths', function() {
    return Paths.find();
});