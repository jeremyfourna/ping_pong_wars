import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Random } from 'meteor/random';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { lodash } from 'meteor/stevezhu:lodash';

import { Championships } from './schema.js';
import { Games } from '../games/schema.js';
import { pointBase, pointsDifference, kEqualForBothPlayers } from '../../startup/sharedFunctions.js';

Meteor.methods({
	createChampionship(data) {
		let methodSchema = new SimpleSchema({
			userId: { type: String },
			name: { type: String },
			public: { type: Boolean },
			minPointsToWin: { type: Number, min: 1 },
			numberOfSetsToPlay: { type: Number, min: 1 },
			numberOfGamesToBeDisplayedInTheRanking: { type: Number, min: 1 },
			numberOfResultsToBeDisplayedInTheGraph: { type: Number, min: 3 }
		});
		check(data, methodSchema);
		data._id = Random.id();
		let data1 = {
			userId: data.userId,
			championshipId: data._id
		};

		Championships.insert({
			_id: data._id,
			name: data.name,
			players: [{
				playerId: data.userId,
				points: [1500]
			}],
			createdAt: new Date(),
			createdBy: data.userId,
			public: data.public,
			minPointsToWin: data.minPointsToWin,
			numberOfSetsToPlay: data.numberOfSetsToPlay,
			numberOfGamesToBeDisplayedInTheRanking: data.numberOfGamesToBeDisplayedInTheRanking,
			numberOfResultsToBeDisplayedInTheGraph: data.numberOfResultsToBeDisplayedInTheGraph
		});
		Meteor.call('addChampionshipIntoProfile', data1);
		return data._id;
	},
	updateChampionship(data) {
		let methodSchema = new SimpleSchema({
			championshipId: { type: String },
			name: { type: String },
			public: { type: Boolean },
			minPointsToWin: { type: Number, min: 1 },
			numberOfSetsToPlay: { type: Number, min: 1 },
			numberOfGamesToBeDisplayedInTheRanking: { type: Number, min: 1 },
			numberOfResultsToBeDisplayedInTheGraph: { type: Number, min: 3 }
		});
		check(data, methodSchema);

		return Championships.update({ _id: data.championshipId }, {
			$set: {
				name: data.name,
				public: data.public,
				minPointsToWin: data.minPointsToWin,
				numberOfSetsToPlay: data.numberOfSetsToPlay,
				numberOfGamesToBeDisplayedInTheRanking: data.numberOfGamesToBeDisplayedInTheRanking,
				numberOfResultsToBeDisplayedInTheGraph: data.numberOfResultsToBeDisplayedInTheGraph
			}
		});
	},
	addPlayerInChampionship(data) {
		let methodSchema = new SimpleSchema({
			userId: { type: String },
			championshipId: { type: String }
		});
		let playerData = {
			playerId: data.userId,
			points: [1500]
		};
		check(data, methodSchema);

		Championships.update({ _id: data.championshipId }, {
			$push: {
				players: playerData
			}
		});

		Meteor.call('addChampionshipIntoProfile', data);
	},
	addPointsForPlayerInChampionship(data) {
		let methodSchema = new SimpleSchema({
			userId: { type: String },
			championshipId: { type: String },
			newPoints: { type: Number }
		});
		check(data, methodSchema);
		let champ = Championships.findOne({ _id: data.championshipId }, {
			fields: {
				players: 1
			}
		});
		let ind = lodash.findIndex(champ.players, ['playerId', data.userId]);
		let res = 'players.' + ind + '.points';
		Championships.update({ _id: data.championshipId }, {
			$push: {
				[res]: data.newPoints
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
			let game1 = {
				championshipId: game.championshipId,
				userId: game.player1,
				newPoints: game.newPointsPlayer1
			};
			let game2 = {
				championshipId: game.championshipId,
				userId: game.player2,
				newPoints: game.newPointsPlayer2
			};
			let game3 = {
				gameId: game._id,
				lastPointsPlayer1: game.lastPointsPlayer1,
				lastPointsPlayer2: game.lastPointsPlayer2,
				kBasePlayer1: game.kBasePlayer1,
				kBasePlayer2: game.kBasePlayer2,
				newPointsPlayer1: game.newPointsPlayer1,
				newPointsPlayer2: game.newPointsPlayer2
			};

			Meteor.call('addPointsForPlayerInChampionship', game1);
			Meteor.call('addPointsForPlayerInChampionship', game2);

			Meteor.call('updateAGame', game3);
		});
	},
	migrate(data) {
		let methodSchema = new SimpleSchema({
			fromChampionshipId: { type: String },
			toChampionshipId: { type: String }
		});
		check(data, methodSchema);
		let usersInDB = Meteor.users.find({}).fetch();
		Games.update({ championshipId: data.fromChampionshipId }, {
			$set: { championshipId: data.toChampionshipId }
		}, { multi: true });
		usersInDB.map((cur, index, array) => {
			let data1 = {
				championshipId: data.toChampionshipId,
				userId: cur._id
			};
			Meteor.call('addPlayerInChampionship', data1);
			Meteor.users.update({ _id: player._id }, {
				$pull: {
					'profile.championships': data.fromChampionshipId
				},
				$push: {
					'profile.championships': data.toChampionshipId
				}
			});
		});
		Meteor.call('refreshPoints', data.toChampionshipId);
		Championships.remove({ _id: data.fromChampionshipId });
	}
});
