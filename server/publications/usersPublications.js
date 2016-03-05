Meteor.publish('allUsers', function() {
	return Meteor.users.find({}, {
		fields: {
			'profile.firstName': 1,
			'profile.lastName': 1,
			'profile.points': 1,
			'_id': 1
		}
	});
});

Meteor.publish('playersForAGame', function(gameId) {
	var players = Games.findOne(gameId);
	return Meteor.users.find({
		$or: [{ _id: players.player1 }, { _id: players.player2 }]
	}, {
		fields: {
			'profile.firstName': 1,
			'profile.lastName': 1,
			'profile.points': 1,
			'_id': 1
		}
	});
});
