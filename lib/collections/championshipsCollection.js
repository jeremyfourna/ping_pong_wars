Championships = new Mongo.Collection('championships');

var Schemas = {};

PlayerPoints = new SimpleSchema({
	playerId: {
		type: String,
		label: 'Player ID'
	},
	points: {
		type: [Number],
		label: 'Player points list'
	}
});

Schemas.Championships = new SimpleSchema({
	name: {
		type: String,
		label: 'Name of the Championship'
	},
	players: {
		type: [PlayerPoints],
		label: 'List of the players'
	},
	createdAt: {
		type: Date,
		label: 'Creation date of the Championship'
	},
	createdBy: {
		type: String,
		label: 'User Id who created the Championship'
	},
	public: {
		type: Boolean,
		label: 'Is the Championship public or private ?'
	}
});

Championships.attachSchema(Schemas.Championships);

Championships.helpers({});

Meteor.methods({
	createChampionship(userId, name, publicOrPrivate) {
		check(userId, String);
		check(name, String);
		check(publicOrPrivate, Boolean);
		var championshipId = Championships.insert({
			name,
			players: [{
				playerId: userId,
				points: [1500]
			}],
			createdAt: new Date(),
			createdBy: userId,
			public: publicOrPrivate
		});

		Meteor.call('addChampionshipIntoProfile', userId, championshipId, function(error, result) {
			if (error) {
				return error;
			}
		});

		return championshipId;
	},
	addPlayerInChampionship(userId, championshipId) {
		check(userId, String);
		check(championshipId, String);
		var playerData = {
			playerId: userId,
			points: [1500]
		};
		// Add championshipId into the user for easier retreive in the future
		Meteor.call('addChampionshipIntoProfile', userId, championshipId, function(error, result) {
			if (error) {
				return error;
			}
		});

		return Championships.update({ _id: championshipId }, {
			$push: {
				players: playerData
			}
		});
	},
	addPointsForPlayerInChampionship(championshipId, userId, newPoints) {
		check(championshipId, String);
		check(userId, String);
		check(newPoints, Number);
		var champ = Championships.findOne({ _id: championshipId });
		var ind = lodash.findIndex(champ.players, ['playerId', userId]);
		var res = 'players.' + ind + '.points';
		return Championships.update({ _id: championshipId }, {
			$push: {
				[res]: newPoints
			}
		});
	},
	refreshPoints(championshipId) {
		check(championshipId, String);
		var theChamp = Championships.findOne({ _id: championshipId });
		// Allow to start anew with the points if the calculus method change (bugs, etc...)
		// Clean users points
		lodash.each(theChamp.players, function(player) {
			var ind = lodash.findIndex(theChamp.players, ['playerId', player.playerId]);
			var res = 'players.' + ind + '.points';
			Championships.update({ _id: championshipId }, {
				$set: {
					[res]: [1500]
				}
			});
		});
		// Fetch all games
		var allGames = Games.find({ championshipId }, { sort: { gameDate: 1 } }).fetch();
		// Loop on each game to calculate the new points
		lodash.each(allGames, function(game) {
			var champData = Championships.findOne({ _id: game.championshipId });
			var ind1 = lodash.findIndex(champData.players, ['playerId', game.player1]);
			var ind2 = lodash.findIndex(champData.players, ['playerId', game.player2]);
			game.lastPointsPlayer1 = lodash.last(champData.players[ind1].points);
			game.lastPointsPlayer2 = lodash.last(champData.players[ind2].points);
			game.kBasePlayer1 = pointBase(champData.players[ind1].points.length, game.lastPointsPlayer1);
			game.kBasePlayer2 = pointBase(champData.players[ind2].points.length, game.lastPointsPlayer2);
			var pointsToAdd = Math.round(game.kBasePlayer1 * (1 / (1 + Math.pow(10, pointsDifference(game.lastPointsPlayer1, game.lastPointsPlayer2) / 400))));
			game.newPointsPlayer1 = game.lastPointsPlayer1 + pointsToAdd;

			if (kEqualForBothPlayers(game.kBasePlayer1, game.kBasePlayer2)) {
				game.newPointsPlayer2 = game.lastPointsPlayer2 - pointsToAdd;
			} else {
				var pointsToLoose = Math.round(pointsToAdd / game.kBasePlayer1 * game.kBasePlayer2);
				game.newPointsPlayer2 = game.lastPointsPlayer2 - pointsToLoose;
			}

			Meteor.call('addPointsForPlayerInChampionship', game.championshipId, game.player1, game.newPointsPlayer1);
			Meteor.call('addPointsForPlayerInChampionship', game.championshipId, game.player2, game.newPointsPlayer2);

			Games.update({ _id: game._id }, {
				$set: {
					lastPointsPlayer1: game.lastPointsPlayer1,
					lastPointsPlayer2: game.lastPointsPlayer2,
					kBasePlayer1: game.kBasePlayer1,
					kBasePlayer2: game.kBasePlayer2,
					newPointsPlayer1: game.newPointsPlayer1,
					newPointsPlayer2: game.newPointsPlayer2
				}
			});
		});
	},
	migrate(champ) {
		var usersInDB = Meteor.users.find({}).fetch();
		Games.update({}, {
			$set: { championshipId: champ }
		}, { multi: true });
		lodash.each(usersInDB, function(player) {
			Meteor.call('addPlayerInChampionship', player._id, champ);
			Meteor.users.update({ _id: player._id }, {
				$set: {
					'profile.championships': [champ]
				}
			});
		});
		Meteor.call('refreshPoints', champ);
	}
});
