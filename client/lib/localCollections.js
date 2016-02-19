// Local (client-only) collection
Errors = new Mongo.Collection(null);

// Function for error message
throwError = function(message) {
	Errors.insert({
		message: message
	});
};
