isAdmin = function (user) {
  user = (typeof user === 'undefined') ? Meteor.user() : user;
  return !!user && !!user.isAdmin;
};
isAdminById = function (userId) {
  var user = Meteor.users.findOne(userId);
  return isAdmin(user);
};
canView = function (user) {
  user = (typeof user === 'undefined') ? Meteor.user() : user;  
  return !!user;
};
canViewById = function (userId) {
  var user = Meteor.users.findOne(userId);
  return canView(user);
};
canEdit = function (user, item) {
  user = (typeof user === 'undefined') ? Meteor.user() : user;

  if (!user || !item) return false;

  return isAdmin(user) || user._id === item._id;
};
canEditById = function (userId, item) {
  var user = Meteor.users.findOne(userId);
  return canEdit(user, item);
};
canRemove = function (user, item) {
  return canEdit(user, item);
};
canRemoveById = function (userId, item) {
  var user = Meteor.users.findOne(userId);
  return canEdit(user, item);
};