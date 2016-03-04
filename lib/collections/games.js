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
			gameDate: gameData.gameDate,
			scorePlayer1: gameData.scorePlayer1,
			scorePlayer2: gameData.scorePlayer2,
			addedBy: gameData.addedBy
		};
		var player1Infos = Meteor.users.findOne({ _id: game.player1 });
		var player2Infos = Meteor.users.findOne({ _id: game.player2 });
		var pointsToAdd = 0;
		var pointsToLoose = 0;
		var lastPointsPlayer1 = _.last(player1Infos.profile.points);
		var lastPointsPlayer2 = _.last(player2Infos.profile.points);
		var pointBasePlayer1 = pointBase(player1Infos.profile.points.length, lastPointsPlayer1);
		var pointBasePlayer2 = pointBase(player2Infos.profile.points.length, lastPointsPlayer2);
		game.lastPointsPlayer1 = lastPointsPlayer1;
		game.lastPointsPlayer2 = lastPointsPlayer2;
		game.kBasePlayer1 = pointBasePlayer1;
		game.kBasePlayer2 = pointBasePlayer2;
		if (kEqualForBothPlayers(pointBasePlayer1, pointBasePlayer2)) {
			pointsToAdd = Math.round(pointBasePlayer1 * (1 / (1 + Math.pow(10, pointsDifference(lastPointsPlayer1, lastPointsPlayer2) / 400))));
			if (winner(game) === game.player1) {
				Meteor.users.update({ _id: game.player1 }, {
					$push: {
						'profile.points': lastPointsPlayer1 + pointsToAdd
					}
				});
				Meteor.users.update({ _id: game.player2 }, {
					$push: {
						'profile.points': lastPointsPlayer2 - pointsToAdd
					}
				});
				game.newPointsPlayer1 = lastPointsPlayer1 + pointsToAdd;
				game.newPointsPlayer2 = lastPointsPlayer2 - pointsToAdd;
			} else if (winner(game) === game.player2) {
				Meteor.users.update({ _id: game.player1 }, {
					$push: {
						'profile.points': lastPointsPlayer1 - pointsToAdd
					}
				});
				Meteor.users.update({ _id: game.player2 }, {
					$push: {
						'profile.points': lastPointsPlayer2 + pointsToAdd
					}
				});
				game.newPointsPlayer1 = lastPointsPlayer1 - pointsToAdd;
				game.newPointsPlayer2 = lastPointsPlayer2 + pointsToAdd;
			}
		} else {
			if (winner(game) === game.player1) {
				pointsToAdd = Math.round(pointBasePlayer1 * (1 / (1 + Math.pow(10, pointsDifference(lastPointsPlayer1, lastPointsPlayer2) / 400))));
				pointsToLoose = Math.round(pointsToAdd / pointBasePlayer1 * pointBasePlayer2);
				Meteor.users.update({ _id: game.player1 }, {
					$push: {
						'profile.points': lastPointsPlayer1 + pointsToAdd
					}
				});
				Meteor.users.update({ _id: game.player2 }, {
					$push: {
						'profile.points': lastPointsPlayer2 - pointsToLoose
					}
				});
				game.newPointsPlayer1 = lastPointsPlayer1 + pointsToAdd;
				game.newPointsPlayer2 = lastPointsPlayer2 - pointsToLoose;
			} else if (winner(game) === game.player2) {
				pointsToAdd = Math.round(pointBasePlayer2 * (1 / (1 + Math.pow(10, pointsDifference(lastPointsPlayer1, lastPointsPlayer2) / 400))));
				pointsToLoose = Math.round(pointsToAdd / pointBasePlayer2 * pointBasePlayer1);
				Meteor.users.update({ _id: game.player1 }, {
					$push: {
						'profile.points': lastPointsPlayer1 - pointsToLoose
					}
				});
				Meteor.users.update({ _id: game.player2 }, {
					$push: {
						'profile.points': lastPointsPlayer2 + pointsToAdd
					}
				});
				game.newPointsPlayer1 = lastPointsPlayer1 - pointsToLoose;
				game.newPointsPlayer2 = lastPointsPlayer2 + pointsToAdd;
			}
		}
		return Games.insert(game);
	},
	refreshPoints: function() {
		var refresh = Meteor.users.update({}, {
			$set: {
				'profile.points': [1500]
			}
		}, {
			multi: true
		});
		var allGames = Games.find({}, {
			sort: {
				gameDate: 1
			}
		}).fetch();
		var allGamesLength = Games.find({}).count();
		for (var i = 0; i < allGamesLength; i++) {
			var player1Infos = Meteor.users.findOne({ _id: allGames[i].player1 });
			var player2Infos = Meteor.users.findOne({ _id: allGames[i].player2 });
			var pointsToAdd = 0;
			var pointsToLoose = 0;
			var lastPointsPlayer1 = _.last(player1Infos.profile.points);
			var lastPointsPlayer2 = _.last(player2Infos.profile.points);
			var pointBasePlayer1 = pointBase(player1Infos.profile.points.length, lastPointsPlayer1);
			var pointBasePlayer2 = pointBase(player2Infos.profile.points.length, lastPointsPlayer2);
			allGames[i].lastPointsPlayer1 = lastPointsPlayer1;
			allGames[i].lastPointsPlayer2 = lastPointsPlayer2;
			allGames[i].kBasePlayer1 = pointBasePlayer1;
			allGames[i].kBasePlayer2 = pointBasePlayer2;
			if (kEqualForBothPlayers(pointBasePlayer1, pointBasePlayer2)) {
				pointsToAdd = Math.round(pointBasePlayer1 * (1 / (1 + Math.pow(10, pointsDifference(lastPointsPlayer1, lastPointsPlayer2) / 400))));
				if (winner(allGames[i]) === allGames[i].player1) {
					Meteor.users.update({ _id: allGames[i].player1 }, {
						$push: {
							'profile.points': lastPointsPlayer1 + pointsToAdd
						}
					});
					Meteor.users.update({ _id: allGames[i].player2 }, {
						$push: {
							'profile.points': lastPointsPlayer2 - pointsToAdd
						}
					});
					allGames[i].newPointsPlayer1 = lastPointsPlayer1 + pointsToAdd;
					allGames[i].newPointsPlayer2 = lastPointsPlayer2 - pointsToAdd;
				} else if (winner(allGames[i]) === allGames[i].player2) {
					Meteor.users.update({ _id: allGames[i].player1 }, {
						$push: {
							'profile.points': lastPointsPlayer1 - pointsToAdd
						}
					});
					Meteor.users.update({ _id: allGames[i].player2 }, {
						$push: {
							'profile.points': lastPointsPlayer2 + pointsToAdd
						}
					});
					allGames[i].newPointsPlayer1 = lastPointsPlayer1 - pointsToAdd;
					allGames[i].newPointsPlayer2 = lastPointsPlayer2 + pointsToAdd;
				}
			} else {
				if (winner(allGames[i]) === allGames[i].player1) {
					pointsToAdd = Math.round(pointBasePlayer1 * (1 / (1 + Math.pow(10, pointsDifference(lastPointsPlayer1, lastPointsPlayer2) / 400))));
					pointsToLoose = Math.round(pointsToAdd / pointBasePlayer1 * pointBasePlayer2);
					Meteor.users.update({ _id: allGames[i].player1 }, {
						$push: {
							'profile.points': lastPointsPlayer1 + pointsToAdd
						}
					});
					Meteor.users.update({ _id: allGames[i].player2 }, {
						$push: {
							'profile.points': lastPointsPlayer2 - pointsToLoose
						}
					});
					allGames[i].newPointsPlayer1 = lastPointsPlayer1 + pointsToAdd;
					allGames[i].newPointsPlayer2 = lastPointsPlayer2 - pointsToLoose;
				} else if (winner(allGames[i]) === allGames[i].player2) {
					pointsToAdd = Math.round(pointBasePlayer2 * (1 / (1 + Math.pow(10, pointsDifference(lastPointsPlayer1, lastPointsPlayer2) / 400))));
					pointsToLoose = Math.round(pointsToAdd / pointBasePlayer2 * pointBasePlayer1);
					Meteor.users.update({ _id: allGames[i].player1 }, {
						$push: {
							'profile.points': lastPointsPlayer1 - pointsToLoose
						}
					});
					Meteor.users.update({ _id: allGames[i].player2 }, {
						$push: {
							'profile.points': lastPointsPlayer2 + pointsToAdd
						}
					});
					allGames[i].newPointsPlayer1 = lastPointsPlayer1 - pointsToLoose;
					allGames[i].newPointsPlayer2 = lastPointsPlayer2 + pointsToAdd;
				}
			}
			console.log(allGames[i]);
			Games.upsert({ _id: allGames[i]._id }, {
				$set: {
					player1: allGames[i].player1,
					player2: allGames[i].player2,
					gameDate: allGames[i].gameDate,
					scorePlayer1: allGames[i].scorePlayer1,
					scorePlayer2: allGames[i].scorePlayer2,
					addedBy: allGames[i].addedBy,
					lastPointsPlayer1: allGames[i].lastPointsPlayer1,
					lastPointsPlayer2: allGames[i].lastPointsPlayer2,
					kBasePlayer1: allGames[i].kBasePlayer1,
					kBasePlayer2: allGames[i].kBasePlayer2,
					newPointsPlayer1: allGames[i].newPointsPlayer1,
					newPointsPlayer2: allGames[i].newPointsPlayer2
				}
			});
		}
	}
});
