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

Meteor.publish('gamesBetweenTwoPlayers', function(gameId) {
	var players = Games.findOne(gameId);
	return Games.find({
		$or: [{
			$and: [
				{ player1: players.player1 },
				{ player2: players.player2 }
			]
		}, {
			$and: [
				{ player2: players.player1 },
				{ player1: players.player2 }
			]
		}]
	});
});

Meteor.publish('allGames', function() {
	return Games.find({});
});

Meteor.publish('aGame', function(gameId) {
	return Games.find({ _id: gameId });
});
