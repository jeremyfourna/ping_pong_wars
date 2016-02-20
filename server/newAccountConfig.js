Accounts.onCreateUser(function(options, user) {
	// We still want the default hook's 'profile' behavior.
	if (options.profile) {
		user.profile = options.profile;
		user.profile.points = [1500];
	} else {
		user.profile = {
			firstName: 'New',
			lastName: 'User',
			points: [1500]
		};
	}
	return user;
});
