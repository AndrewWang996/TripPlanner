Template.pathItemHeader.events({

    /**
        Remove path from the Paths Meteor Collection
        Also reactively removes path from the HTML
    */
    'click .js-delete-path': function(event, template) {
        Meteor.call('removePath', this._id, function (error) {
            if (error)
                alert(error.reason)
        });
    },
    'click .js-edit-path': function(event, template) {
    	Router.route("/paths/:fileName");
    	console.log("hi");
    }
});
