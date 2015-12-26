
Template.pathItemHeader.onCreated(function() {
    this._dropdownHidden = new ReactiveVar(true);
});

Template.pathItemHeader.helpers({
    dropdownHidden: function() {
        return Template.instance()._dropdownHidden.get();
    }
});

Template.pathItemHeader.events({

    /**
        Remove path from the Paths Meteor Collection
        Also reactively removes path from the HTML
    */
    'click .js-delete-path': function(event, template) {
        Meteor.call('removePath', this._id, function (error) {
            if (error)
                alert(error.reason);
        });
    },
    'click .js-edit-path': function(event, template) {
    	
    },
    'click .dropdown-btn': function(event, template) {
        var isHidden = template._dropdownHidden.get();
        template._dropdownHidden.set( ! isHidden );
    }
});