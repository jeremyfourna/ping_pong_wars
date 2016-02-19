Template.errors.helpers({
	// Recovers the errors in the local errors collection
	errors: function() {
		return Errors.find();
	}
});
