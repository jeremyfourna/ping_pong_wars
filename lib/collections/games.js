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
	winner: function() {
		if (this.scorePlayer1 > this.scorePlayer2) {
			return this.player1;
		} else {
			return this.player2;
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
	}
});

Meteor.methods({
	addAGame: function(gameData) {
		check(gameData, Object);
		check(gameData.player1, String);
		check(gameData.player2, String);
		check(gameData.scorePlayer1, Number);
		check(gameData.scorePlayer2, Number);
		check(gameData.addedBy, String);
		var game = {
			player1: gameData.player1,
			player2: gameData.player2,
			gameDate: new Date(),
			scorePlayer1: gameData.scorePlayer1,
			scorePlayer2: gameData.scorePlayer2,
			addedBy: gameData.addedBy
		};
		var player1Infos = Meteor.users.findOne({ _id: game.player1 });
		var player2Infos = Meteor.users.findOne({ _id: game.player2 });
		var pointsToAdd = 0;
		var pointsToLoose = 0;
		if (kEqualForBothPlayers(pointBase(player1Infos.profile.points.length, _.last(player1Infos.profile.points)), pointBase(player2Infos.profile.points.length, _.last(player2Infos.profile.points)))) {
			if (winner(game) === game.player1) {
				pointsToAdd = Math.round(lastPoints1 + pointBase(player1Infos.profile.points.length, lastPoints1) * (1 - 1 / (1 + Math.pow(10, pointsDifference(lastPoints1 - lastPoints2) / 400))));
				pointsToLoose = Math.round(lastPoints2 + pointBase(player2Infos.profile.points.length, lastPoints2) * (0 - 1 / (1 + Math.pow(10, (lastPoints1 - lastPoints2) / 400))));
				Meteor.users.update({ _id: game.player1 }, {
					$push: {
						'profile.points': pointsToAdd
					}
				});
				Meteor.users.update({ _id: game.player2 }, {
					$push: {
						'profile.points': pointsToLoose
					}
				});
				game.newPointsPlayer1 = pointsToAdd;
				game.newPointsPlayer2 = pointsToLoose;
			} else if (winner() === game.player2) {
				pointsToAdd = Math.round(lastPoints2 + pointBase(player2Infos.profile.points.length, lastPoints2) * (1 - 1 / (1 + Math.pow(10, (lastPoints1 - lastPoints2) / 400))));
				pointsToLoose = Math.round(lastPoints1 + pointBase(player1Infos.profile.points.length, lastPoints1) * (0 - 1 / (1 + Math.pow(10, (lastPoints1 - lastPoints2) / 400))));
				Meteor.users.update({ _id: game.player2 }, {
					$push: {
						'profile.points': pointsToAdd
					}
				});
				Meteor.users.update({ _id: game.player1 }, {
					$push: {
						'profile.points': pointsToLoose
					}
				});
				game.newPointsPlayer1 = pointsToLoose;
				game.newPointsPlayer2 = pointsToAdd;
			}
		}
		game.lastPointsPlayer1 = lastPoints1;
		game.lastPointsPlayer2 = lastPoints2;
		return Games.insert(game);
	}
});
