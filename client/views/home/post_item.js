Template.postItem.events({
  'click .js-edit-post': function (event, template) {
    Session.set('currentPost', this);
  },
  'click .js-delete-post': function () {
    if(confirm('Are you sure you want to delete ' + this.title + '?')) {
      Meteor.call('deletePost', this._id, function (error) {
        if (error)
          alert(error.reason);
      });
      $('#editPostModal').modal('hide');
    }
  }
});