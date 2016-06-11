Meteor.publish('lastGamesForAChampionship', function(championshipId) {
	check(championshipId, String);
	return Games.find({ championshipId }, {
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

Meteor.publish('gamesBetweenTwoPlayersInAChampionship', function(gameId) {
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
		}],
		championshipId: players.championshipId
	});
});

Meteor.publish('allGamesForAChampionship', function(championshipId) {
	check(championshipId, String);
	return Games.find({ championshipId });
});

Meteor.publish('aGame', function(gameId) {
	return Games.find({ _id: gameId });
});
