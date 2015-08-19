Router.configure({
  layoutTemplate: 'mainLayout',
  notFoundTemplate: 'notFound',
  waitOn: function () {
    // subs.subscribe('settings');
  }
});

Router.plugin('loading', { loadingTemplate: 'loading' });
Router.plugin('dataNotFound', { dataNotFoundTemplate: 'notFound' });

Router.route('/', function() {
	// this.render('home');
	this.render('locEntry');
});

// Router.route('/', {
// 	template: 'home',
// 	waitOn: function() {

// 	},
// 	fastRender: true
// });

Router.route('/locEntry',{
	template: 'locEntry',
	waitOn: function() {

	},
	fastRender: true
});

// Router.route('/locEntry');


