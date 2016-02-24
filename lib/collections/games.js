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
	practiceGame: {
		type: Boolean,
		label: 'Is a practice game'
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
			return player1;
		} else {
			return player2;
		}
	}
});




Meteor.methods({
	addAGame: function(gameData) {
		var player1Infos = Meteor.users.findOne({ _id: gameData.player1 });
		var player2Infos = Meteor.users.findOne({ _id: gameData.player2 });
		var lastPoints1 = player1Infos.profile.points.pop();
		var lastPoints2 = player2Infos.profile.points.pop();
		var pointsToAdd = 0;
		var pointsToLoose = 0;
		var pointBase = 40;
		var winner = function() {
			if (Number(gameData.scorePlayer1) > Number(gameData.scorePlayer2)) {
				return gameData.player1;
			} else {
				return gameData.player2;
			}
		};
		if (lastPoints1 - lastPoints2 < 400 && lastPoints2 - lastPoints1 > -400) {
			if (winner() === gameData.player1) {
				pointsToAdd = Math.round(lastPoints1 + pointBase * (1 - 1 / (1 + Math.pow(10, (lastPoints1 - lastPoints2) / 400))));
				pointsToLoose = Math.round(lastPoints2 + pointBase * (0 - 1 / (1 + Math.pow(10, (lastPoints2 - lastPoints1) / 400))));
				Meteor.users.update({ _id: gameData.player1 }, {
					$push: {
						'profile.points': pointsToAdd
					}
				});
				Meteor.users.update({ _id: gameData.player2 }, {
					$push: {
						'profile.points': pointsToLoose
					}
				});
			} else if (winner() === gameData.player2) {
				pointsToAdd = Math.round(lastPoints2 + pointBase * (1 - 1 / (1 + Math.pow(10, (lastPoints2 - lastPoints1) / 400))));
				pointsToLoose = Math.round(lastPoints1 + pointBase * (0 - 1 / (1 + Math.pow(10, (lastPoints1 - lastPoints2) / 400))));
				Meteor.users.update({ _id: gameData.player2 }, {
					$push: {
						'profile.points': pointsToAdd
					}
				});
				Meteor.users.update({ _id: gameData.player1 }, {
					$push: {
						'profile.points': pointsToLoose
					}
				});
			}
			gameData.practiceGame = false;
			return Games.insert(gameData);
		} else {
			gameData.practiceGame = true;
			return Games.insert(gameData);
		}
	}
});
