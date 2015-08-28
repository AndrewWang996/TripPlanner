if(Meteor.isClient){
  Meteor.startup( function(){
    GoogleMaps.load({
      key: 'AIzaSyCLPZ7L1MROZUEP4w-5dbKYnyIrcyM6fV4',
      libraries: 'places'
    });
  });
}

Router.configure({
  layoutTemplate: 'mainLayout',
  notFoundTemplate: 'notFound',
  waitOn: function () {
    // subs.subscribe('settings');
  }
});

Router.plugin('loading', { loadingTemplate: 'loading' });
Router.plugin('dataNotFound', { dataNotFoundTemplate: 'notFound' });

// Router.onBeforeAction(function() {
//   GoogleMaps.load();
//   this.next();
// }, { only: ['paths'] });

Router.route('/', {
	name: 'home'
	// fastRender: true
});

Router.route('/locEntry', {
	// fastRender: true
});

Router.route('/contact', {
	// fastRender: true
});

Router.route('/paths', {
	// fastRender: true
});

// Router.route('/home', {
// 	fastRender: true
// });




