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
		label: 'Is a practice game ?'
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
		var player1Infos = Meteor.users.findOne({ _id: gameData.player1 });
		var player2Infos = Meteor.users.findOne({ _id: gameData.player2 });
		var lastPoints1 = player1Infos.profile.points.pop();
		var lastPoints2 = player2Infos.profile.points.pop();
		var pointsToAdd = 0;
		var pointsToLoose = 0;
		var pointBase = function(pointsLength, currentPoints) {
			if (pointsLength < 30) {
				return 40;
			} else if (currentPoints <= 2400) {
				return 20;
			} else if (currentPoints > 2400) {
				return 10;
			}
		};
		var winner = function() {
			if (Number(gameData.scorePlayer1) > Number(gameData.scorePlayer2)) {
				return gameData.player1;
			} else {
				return gameData.player2;
			}
		};
		var diff = function(lp1, lp2) {
			var result;
			if (lp1 - lp2 > 0) {
				result = lp1 - lp2 < 400;
				return result;
			} else {
				result = lp1 - lp2 > -400;
				return result;
			}
		};
		player1Infos.profile.points.push(lastPoints1);
		player2Infos.profile.points.push(lastPoints2);
		if (diff(lastPoints1, lastPoints2)) {
			if (winner() === gameData.player1) {
				pointsToAdd = Math.round(lastPoints1 + pointBase(player1Infos.profile.points.length, lastPoints1) * (1 - 1 / (1 + Math.pow(10, (lastPoints1 - lastPoints2) / 400))));
				pointsToLoose = Math.round(lastPoints2 + pointBase(player2Infos.profile.points.length, lastPoints2) * (0 - 1 / (1 + Math.pow(10, (lastPoints1 - lastPoints2) / 400))));
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
				gameData.newPointsPlayer1 = pointsToAdd;
				gameData.newPointsPlayer2 = pointsToLoose;
			} else if (winner() === gameData.player2) {
				pointsToAdd = Math.round(lastPoints2 + pointBase(player2Infos.profile.points.length, lastPoints2) * (1 - 1 / (1 + Math.pow(10, (lastPoints1 - lastPoints2) / 400))));
				pointsToLoose = Math.round(lastPoints1 + pointBase(player1Infos.profile.points.length, lastPoints1) * (0 - 1 / (1 + Math.pow(10, (lastPoints1 - lastPoints2) / 400))));
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
				gameData.newPointsPlayer1 = pointsToLoose;
				gameData.newPointsPlayer2 = pointsToAdd;
			}
			gameData.lastPointsPlayer1 = lastPoints1;
			gameData.lastPointsPlayer2 = lastPoints2;
			gameData.practiceGame = false;
			return Games.insert(gameData);
		} else {
			gameData.practiceGame = true;
			return Games.insert(gameData);
		}
	}
});
