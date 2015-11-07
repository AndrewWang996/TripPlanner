Meteor.startup(function () {
    return Meteor.methods({
        removeAllLocations: function(){
            return Locations.remove({});
        },
        removeAllPaths: function(){
            return Paths.remove({});
        },
        removePath: function(id){
            return Paths.remove({_id: id});
        }
    }); 

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
});
