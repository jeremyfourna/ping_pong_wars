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
		user.profile.championships = [];
		user.profile.tournaments = [];
		user.profile.fullName = options.profile.firstName + ' ' + options.profile.lastName;
		user.profile.worldPoints = 0;
	} else {
		user.profile = {
			firstName: 'New',
			lastName: 'User',
			fullName: 'New User',
			championships: [],
			tournaments: [],
			worldPoints: 0
		};
	}
	return user;
});
