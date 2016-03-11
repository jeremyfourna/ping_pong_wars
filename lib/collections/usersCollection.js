Meteor.users.helpers({});

Meteor.methods({
	updateUserData(user) {
		check(user.firstName, String);
		check(user.lastName, String);
		check(user.userId, String);
		Meteor.users.update({ _id: user.userId }, {
			$set: {
				'profile.firstName': user.firstName,
				'profile.lastName': user.lastName
			}
		});
	},
	addChampionshipIntoProfile(userId, championshipId) {
		check(userId, String);
		check(championshipId, String);
		Meteor.users.update({ _id: userId }, {
			$push: {
				'profile.championships': championshipId
			}
		});
	}
});
