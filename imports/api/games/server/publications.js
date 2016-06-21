import { Meteor } from 'meteor/meteor';

import { Games } from '../schema.js';

Meteor.publish('lastGamesForAChampionship', (championshipId) => {
	check(championshipId, String);
	return Games.find({ championshipId }, {
		sort: {
			gameDate: -1
		},
		limit: 20
	});
});

Meteor.publish('userGames', (userId) => {
	return Games.find({
		$or: [{ player1: userId }, { player2: userId }]
	}, {
		sort: {
			gameDate: -1
		}
	});
});

Meteor.publish('gamesBetweenTwoPlayersInAChampionship', (gameId) => {
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

Meteor.publish('allGamesForAChampionship', (championshipId) => {
	check(championshipId, String);
	return Games.find({ championshipId });
});

Meteor.publish('aGame', (gameId) => {
	return Games.find({ _id: gameId });
});
