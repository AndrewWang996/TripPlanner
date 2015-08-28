Template.homeCarousel.helpers({
  isActive: function () { // set the first item to be active by default
    return this.index === 0 ? 'active': '';
  },
  pictures: function () {
    var pictures = Pictures.find({ 'metadata.featured': true }).fetch();
    pictures = _.map(pictures, function (picture, index) {
      picture.index = index;
      return picture;
    });

    return pictures;
  }
});
