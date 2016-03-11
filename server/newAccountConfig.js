Accounts.onCreateUser(function(options, user) {
	// We still want the default hook's 'profile' behavior.
	if (options.profile) {
		user.profile = options.profile;
		if (!user.profile.firstName) {
			user.profile.firstName = user.username;
		}
		if (!user.profile.lastName) {
			user.profile.lastName = user.username;
		}
	} else {
		user.profile = {
			firstName: 'New',
			lastName: 'User',
		};
	}
	return user;
});
