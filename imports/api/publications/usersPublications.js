Meteor.publish('allUsers', function() {
	return Meteor.users.find({}, {
		fields: {
			'profile.firstName': 1,
			'profile.lastName': 1,
			'_id': 1
		}
	});
});

Meteor.publish('allUsersForAChampionship', function(championshipId) {
	check(championshipId, String);
	return Meteor.users.find({ 'profile.championships': championshipId }, {
		fields: {
			'profile.firstName': 1,
			'profile.lastName': 1,
			'profile.championships': 1,
			'_id': 1
		}
	});
});

Meteor.publish('aUser', function(userId) {
	return Meteor.users.find({ _id: userId }, {
		fields: {
			'profile.firstName': 1,
			'profile.lastName': 1,
			'profile.championships': 1,
			'_id': 1
		}
	});
});

Meteor.publish('playersForAGame', function(gameId) {
	check(gameId, String);
	var players = Games.findOne(gameId);
	return Meteor.users.find({
		$or: [{ _id: players.player1 }, { _id: players.player2 }]
	}, {
		fields: {
			'profile.firstName': 1,
			'profile.lastName': 1,
			'_id': 1
		}
	});
});
