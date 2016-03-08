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
		label: "K for player 1"
	},
	kBasePlayer2: {
		type: Number,
		label: "K for player 2"
	},
	addedBy: {
		type: String,
		label: 'User Id who added the game'
	}
});

Games.attachSchema(Schemas.Games);

Games.helpers({
	player1Data: function() {
		return Meteor.users.findOne(this.player1);
	},
	player2Data: function() {
		return Meteor.users.findOne(this.player2);
	},
	scoreGap: function() {
		if (this.scorePlayer1 > this.scorePlayer2) {
			return this.scorePlayer1 - this.scorePlayer2;
		} else {
			return this.scorePlayer2 - this.scorePlayer1;
		}
	},
	over10: function() {
		if (this.scorePlayer1 > 10 || this.scorePlayer2 > 10) {
			return true;
		} else {
			return false;
		}
	},
	lastPointsGap: function() {
		if (this.lastPointsPlayer1 > this.lastPointsPlayer2) {
			return this.lastPointsPlayer1 - this.lastPointsPlayer2;
		} else {
			return this.lastPointsPlayer2 - this.lastPointsPlayer1;
		}
	},
	newPointsGap: function() {
		if (this.newPointsPlayer1 > this.newPointsPlayer2) {
			return this.newPointsPlayer1 - this.newPointsPlayer2;
		} else {
			return this.newPointsPlayer2 - this.newPointsPlayer1;
		}
	},
	kBaseGap: function() {
		if (this.kBasePlayer1 > this.kBasePlayer2) {
			return this.kBasePlayer1 - this.kBasePlayer2;
		} else {
			return this.kBasePlayer2 - this.kBasePlayer1;
		}
	}
});

Meteor.methods({
	addAGame: function(gameData) {
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
			addedBy: gameData.addedBy
		};
		var player1Infos = Meteor.users.findOne({ _id: game.player1 });
		var player2Infos = Meteor.users.findOne({ _id: game.player2 });
		game.lastPointsPlayer1 = _.last(player1Infos.profile.points);
		game.lastPointsPlayer2 = _.last(player2Infos.profile.points);
		game.kBasePlayer1 = pointBase(player1Infos.profile.points.length, game.lastPointsPlayer1);
		game.kBasePlayer2 = pointBase(player2Infos.profile.points.length, game.lastPointsPlayer2);
		var pointsToAdd = Math.round(game.kBasePlayer1 * (1 / (1 + Math.pow(10, pointsDifference(game.lastPointsPlayer1, game.lastPointsPlayer2) / 400))));
		game.newPointsPlayer1 = game.lastPointsPlayer1 + pointsToAdd;

		if (kEqualForBothPlayers(game.kBasePlayer1, game.kBasePlayer2)) {
			game.newPointsPlayer2 = game.lastPointsPlayer2 - pointsToAdd;
			addAndRemovePointsForUsers(game.player1, game.player2, game.newPointsPlayer1, game.newPointsPlayer2);
		} else {
			var pointsToLoose = Math.round(pointsToAdd / game.kBasePlayer1 * game.kBasePlayer2);
			game.newPointsPlayer2 = game.lastPointsPlayer2 - pointsToLoose;
			addAndRemovePointsForUsers(game.player1, game.player2, game.newPointsPlayer1, game.newPointsPlayer2);
		}

		// Insert game Object in the Games collection
		return Games.insert(game);
	},
	refreshPoints: function() {
		// Allow to start anew with the points if the calculus method change (bugs, etc...)
		// Clean users points
		var refresh = Meteor.users.update({}, { $set: { 'profile.points': [1500] } }, { multi: true });
		// Fetch all games
		var allGames = Games.find({}, { sort: { gameDate: 1 } }).fetch();
		// Loop on each game to calculate the new points
		for (var i = 0; i < allGames.length; i++) {
			var player1Infos = Meteor.users.findOne({ _id: allGames[i].player1 });
			var player2Infos = Meteor.users.findOne({ _id: allGames[i].player2 });
			allGames[i].lastPointsPlayer1 = _.last(player1Infos.profile.points);
			allGames[i].lastPointsPlayer2 = _.last(player2Infos.profile.points);
			allGames[i].kBasePlayer1 = pointBase(player1Infos.profile.points.length, allGames[i].lastPointsPlayer1);
			allGames[i].kBasePlayer2 = pointBase(player2Infos.profile.points.length, allGames[i].lastPointsPlayer2);
			var pointsToAdd = Math.round(allGames[i].kBasePlayer1 * (1 / (1 + Math.pow(10, pointsDifference(allGames[i].lastPointsPlayer1, allGames[i].lastPointsPlayer2) / 400))));
			allGames[i].newPointsPlayer1 = allGames[i].lastPointsPlayer1 + pointsToAdd;
			if (kEqualForBothPlayers(allGames[i].kBasePlayer1, allGames[i].kBasePlayer2)) {
				allGames[i].newPointsPlayer2 = allGames[i].lastPointsPlayer2 - pointsToAdd;
				addAndRemovePointsForUsers(allGames[i].player1, allGames[i].player2, allGames[i].newPointsPlayer1, allGames[i].newPointsPlayer2);
			} else {
				var pointsToLoose = Math.round(pointsToAdd / allGames[i].kBasePlayer1 * allGames[i].kBasePlayer2);
				allGames[i].newPointsPlayer2 = allGames[i].lastPointsPlayer2 - pointsToLoose;
				addAndRemovePointsForUsers(allGames[i].player1, allGames[i].player2, allGames[i].newPointsPlayer1, allGames[i].newPointsPlayer2);
			}
			Games.update({ _id: allGames[i]._id }, {
				$set: {
					lastPointsPlayer1: allGames[i].lastPointsPlayer1,
					lastPointsPlayer2: allGames[i].lastPointsPlayer2,
					kBasePlayer1: allGames[i].kBasePlayer1,
					kBasePlayer2: allGames[i].kBasePlayer2,
					newPointsPlayer1: allGames[i].newPointsPlayer1,
					newPointsPlayer2: allGames[i].newPointsPlayer2
				}
			});
		}
		console.log('refreshPoints : Done');
	},
	cleanGamesCollection: function() {
		// Method to clean the Games collection, all games must have player1 have winner
		var allGames = Games.find({}).fetch();
		// Loop on each game to see if the player2 is the winner
		for (var i = 0; i < allGames.length; i++) {
			if (allGames[i].scorePlayer1 < allGames[i].scorePlayer2) {
				console.log(allGames[i]);
				Games.update({ _id: allGames[i]._id }, {
					$set: {
						player1: allGames[i].player2,
						player2: allGames[i].player1,
						scorePlayer1: allGames[i].scorePlayer2,
						scorePlayer2: allGames[i].scorePlayer1,
						lastPointsPlayer1: allGames[i].lastPointsPlayer2,
						lastPointsPlayer2: allGames[i].lastPointsPlayer1,
						kBasePlayer1: allGames[i].kBasePlayer2,
						kBasePlayer2: allGames[i].kBasePlayer1,
						newPointsPlayer1: allGames[i].newPointsPlayer2,
						newPointsPlayer2: allGames[i].newPointsPlayer1
					}
				});
			}
		}
		console.log('cleanGamesCollection : Done');
	}
});
