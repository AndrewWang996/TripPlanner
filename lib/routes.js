Router.configure({
  layoutTemplate: 'mainLayout',
  notFoundTemplate: 'notFound',
  waitOn: function () {
    // subs.subscribe('settings');
  }
});

Router.plugin('loading', { loadingTemplate: 'loading' });
Router.plugin('dataNotFound', { dataNotFoundTemplate: 'notFound' });

Router.onBeforeAction(function() {
  GoogleMaps.load();
  this.next();
}, { only: ['paths'] });

Router.route('/', {
	name: 'home',
	fastRender: true
});

Router.route('/locEntry', {
	fastRender: true
});

Router.route('/contact', {
	fastRender: true
});

Router.route('/paths', {
	fastRender: true
});

// Router.route('/home', {
// 	fastRender: true
// });




