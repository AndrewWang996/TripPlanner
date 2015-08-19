Template.nav.helpers({
  currentPage: function (page) {
    return getCurrentRoute() === page ? 'active' : '';
  }
});

Template.nav.events({
  'click #js-logout': function () {
    Meteor.logout(function () {
      Router.go('home');
    });
  },
  'submit #js-login': function (event, template) {
    event.preventDefault();
    var email = template.find('#js-email').value;
    var password = template.find('#js-password').value;
    
    Meteor.loginWithPassword(email, password, function (error) {
      if (error)
        alert(getError('login-error'));
    });
  }
});