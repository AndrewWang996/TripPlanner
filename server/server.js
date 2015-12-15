Meteor.startup(function () {
    
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
    Paths.remove({}); 


    Locations.remove({});

    return Meteor.methods({
        /**
            Remove all the Location objects from the Locations Collection.
        */
        removeAllLocations: function() {
            return Locations.remove({});
        },
        /**
            Remove all the Path objects from the Paths Collection
        */
        removeAllPaths: function() {
            return Paths.remove({});
        },
        /**
            Remove a specific Path object from the Paths Collection.
        */
        removePath: function(id) {
            return Paths.remove({_id: id});
        },
        /**
            Update a Path object with the given id 
        */
        updatePath: function(name, newPath) {
            return Paths.update({pathName: name}, {$set: {path: newPath}});
        }
    }); 
});
