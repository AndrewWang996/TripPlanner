
Meteor.publish('allPaths', function() {
    return Paths.find();
});

Meteor.publish('singlePath', function(pathId) {
    return Paths.find({_id: pathId});
});