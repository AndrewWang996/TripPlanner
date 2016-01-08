// SimpleSchema.debug = true

GLOBAL.errors = {
  'default': 'Sorry, something went wrong.',

  'confirm-remove-path': 'Are you sure you want to delete this path?'
};

getError = function (error) {
	if (error && typeof Errors[error] !== 'undefined')
		return Errors[error];
	else
		return error || Errors['default'];
};