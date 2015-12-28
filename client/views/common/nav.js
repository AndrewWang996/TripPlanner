Template.nav.onCreated(function() {
    this._dropdownHidden = new ReactiveVar(false);
});

Template.nav.helpers({
    currentPage: function (page) {
        return getCurrentRoute() === page ? 'active' : '';
    },
    dropdownHidden: function() {
        return Template.instance()._dropdownHidden.get();
    }
});

Template.nav.events({
    'click #nav-toggle, click #nav-dropdown-menu': function(e, template) {
        var isHidden = template._dropdownHidden.get();

        console.log(isHidden);
        template._dropdownHidden.set( ! isHidden );
    }
});