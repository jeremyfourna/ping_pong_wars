import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser((options, user) => {
	// We still want the default hook's 'profile' behavior.
	if (options.profile) {
		user.profile = options.profile;
		if (!user.profile.firstName) {
			user.profile.firstName = user.username;
		}
		if (!user.profile.lastName) {
			user.profile.lastName = user.username;
		}
		user.championships = [];
		user.tournaments = [];
	} else {
		user.profile = {
			firstName: 'New',
			lastName: 'User',
			fullName: 'New User',
			championships: [],
			tournaments: []
		};
	}
	return user;
});
