
Router.configure({
  layoutTemplate: 'mainLayout',
  notFoundTemplate: 'notFound',
  waitOn: function () {
    // subs.subscribe('settings');
  }
});

Router.plugin('loading', { loadingTemplate: 'loading' });
Router.plugin('dataNotFound', { dataNotFoundTemplate: 'notFound' });

Router.route('/', {
	name: 'home'
	// fastRender: true
});

Router.route('/main', {

});

Router.route('/locEntry', {
	// fastRender: true
});

Router.route('/contact', {
	// fastRender: true
});

Router.route('/paths', {
    waitOn: function() {
        return Meteor.subscribe('allPaths');
    }
});

Router.route('/paths/edit/:_id', {
	template: 'pathEdit',
	data: function() {
		var currentPath = Paths.findOne({_id: this.params._id});
		return currentPath;
	}
});



