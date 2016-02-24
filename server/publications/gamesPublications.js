Meteor.publish('lastGames', function() {
	return Games.find({}, {
		sort: {
			gameDate: -1
		},
		limit: 20
	});
});

Meteor.publish('userGames', function(userId) {
	return Games.find({
		$or: [{ player1: userId }, { player2: userId }]
	}, {
		sort: {
			gameDate: -1
		}
	});
});
