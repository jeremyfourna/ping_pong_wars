// Allow the app to remove the error message after 3 seconds
Template.error.rendered = function() {
	var error = this.data;
	Meteor.setTimeout(function() {
		Errors.remove(error._id);
	}, 3000);
};
