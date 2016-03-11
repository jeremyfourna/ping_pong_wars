Games = new Mongo.Collection('games');

var Schemas = {};

Schemas.Games = new SimpleSchema({
	player1: {
		type: String,
		label: 'User ID of player1'
	},
	player2: {
		type: String,
		label: 'User ID of player2'
	},
	gameDate: {
		type: Date,
		label: 'Date of the game'
	},
	scorePlayer1: {
		type: Number,
		label: 'Player1 score',
		min: 0
	},
	scorePlayer2: {
		type: Number,
		label: 'player2 score',
		min: 0
	},
	lastPointsPlayer1: {
		type: Number,
		label: 'Player 1 points before the game',
		optional: true
	},
	lastPointsPlayer2: {
		type: Number,
		label: 'Player 2 points before the game',
		optional: true
	},
	newPointsPlayer1: {
		type: Number,
		label: 'Player 1 points after the game',
		optional: true
	},
	newPointsPlayer2: {
		type: Number,
		label: 'Player 2 points after the game',
		optional: true
	},
	kBasePlayer1: {
		type: Number,
		label: 'K for player 1'
	},
	kBasePlayer2: {
		type: Number,
		label: 'K for player 2'
	},
	addedBy: {
		type: String,
		label: 'User Id who added the game'
	},
	championshipId: {
		type: String,
		label: 'Championship ID',
		optional: true
	},
	tournamentId: {
		type: String,
		label: 'Tournament ID',
		optional: true
	}
});

Games.attachSchema(Schemas.Games);

Games.helpers({
	player1Data() {
		return Meteor.users.findOne(this.player1);
	},
	player2Data() {
		return Meteor.users.findOne(this.player2);
	},
	scoreGap() {
		if (this.scorePlayer1 > this.scorePlayer2) {
			return this.scorePlayer1 - this.scorePlayer2;
		} else {
			return this.scorePlayer2 - this.scorePlayer1;
		}
	},
	over10() {
		if (this.scorePlayer1 > 10 || this.scorePlayer2 > 10) {
			return true;
		} else {
			return false;
		}
	},
	lastPointsGap() {
		if (this.lastPointsPlayer1 > this.lastPointsPlayer2) {
			return this.lastPointsPlayer1 - this.lastPointsPlayer2;
		} else {
			return this.lastPointsPlayer2 - this.lastPointsPlayer1;
		}
	},
	newPointsGap() {
		if (this.newPointsPlayer1 > this.newPointsPlayer2) {
			return this.newPointsPlayer1 - this.newPointsPlayer2;
		} else {
			return this.newPointsPlayer2 - this.newPointsPlayer1;
		}
	},
	kBaseGap() {
		if (this.kBasePlayer1 > this.kBasePlayer2) {
			return this.kBasePlayer1 - this.kBasePlayer2;
		} else {
			return this.kBasePlayer2 - this.kBasePlayer1;
		}
	},
	championshipName() {
		return Championships.findOne(this.championshipId).name;
	},
	tournamentName() {
		return Tournaments.findOne(this.tournamentId).name;
	}
});

Meteor.methods({
	addAGame(gameData) {
		// Check the params of the function
		check(gameData, Object);
		check(gameData.player1, String);
		check(gameData.player2, String);
		check(gameData.scorePlayer1, Number);
		check(gameData.scorePlayer2, Number);
		check(gameData.addedBy, String);

		// Define again the object to protect against bad object
		var game = {
			player1: gameData.player1,
			player2: gameData.player2,
			gameDate: gameData.gameDate,
			scorePlayer1: gameData.scorePlayer1,
			scorePlayer2: gameData.scorePlayer2,
			addedBy: gameData.addedBy,
			championshipId: gameData.championshipId
		};
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
			addAndRemovePointsForUsers(game.player1, game.player2, game.newPointsPlayer1, game.newPointsPlayer2, 'championship', game.championshipId);
		} else {
			var pointsToLoose = Math.round(pointsToAdd / game.kBasePlayer1 * game.kBasePlayer2);
			game.newPointsPlayer2 = game.lastPointsPlayer2 - pointsToLoose;
			addAndRemovePointsForUsers(game.player1, game.player2, game.newPointsPlayer1, game.newPointsPlayer2, 'championship', game.championshipId);
		}

		// Insert game Object in the Games collection
		return Games.insert(game);
	},
	cleanGamesCollection() {
		// Method to clean the Games collection, all games must have player1 have winner
		var allGames = Games.find({}).fetch();
		// Loop on each game to see if the player2 is the winner
		lodash.each(allGames, function(game) {
			if (game.scorePlayer1 < game.scorePlayer2) {
				console.log(game);
				Games.update({ _id: game._id }, {
					$set: {
						player1: game.player2,
						player2: game.player1,
						scorePlayer1: game.scorePlayer2,
						scorePlayer2: game.scorePlayer1,
						lastPointsPlayer1: game.lastPointsPlayer2,
						lastPointsPlayer2: game.lastPointsPlayer1,
						kBasePlayer1: game.kBasePlayer2,
						kBasePlayer2: game.kBasePlayer1,
						newPointsPlayer1: game.newPointsPlayer2,
						newPointsPlayer2: game.newPointsPlayer1
					}
				});
			}
		});
		console.log('cleanGamesCollection : Done');
	}
});
