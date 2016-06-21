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
	refreshPoints(data) {
		let methodSchema = new SimpleSchema({
			championshipId: { type: String }
		});
		check(data, methodSchema);
		let champ = Championships.findOne({ _id: data.championshipId }, {
			fields: {
				players: 1
			}
		});
		// Allow to start anew with the points if the calculus method change (bugs, etc...)
		// Clean users points
		champ.players.map((cur, index, array) => {
			let ind = lodash.findIndex(champ.players, ['playerId', cur.playerId]);
			let res = 'players.' + ind + '.points';
			Championships.update({ _id: data.championshipId }, {
				$set: {
					[res]: [1500]
				}
			});
		});
		// Fetch all games
		let allGames = Games.find({ championshipId: data.championshipId }, { sort: { gameDate: 1 } }).fetch();
		let champOfTheGame = Championships.findOne({ _id: data.championshipId }, {
			fields: {
				players: 1
			}
		});
		// Loop on each game to calculate the new points
		allGames.map((cur, index, array) => {
			let ind1 = lodash.findIndex(champOfTheGame.players, ['playerId', cur.player1]);
			let ind2 = lodash.findIndex(champOfTheGame.players, ['playerId', cur.player2]);
			cur.lastPointsPlayer1 = lodash.last(champOfTheGame.players[ind1].points);
			cur.lastPointsPlayer2 = lodash.last(champOfTheGame.players[ind2].points);
			cur.kBasePlayer1 = pointBase(champOfTheGame.players[ind1].points.length, cur.lastPointsPlayer1);
			cur.kBasePlayer2 = pointBase(champOfTheGame.players[ind2].points.length, cur.lastPointsPlayer2);
			let pointsToAdd = Math.round(cur.kBasePlayer1 * (1 / (1 + Math.pow(10, pointsDifference(cur.lastPointsPlayer1, cur.lastPointsPlayer2) / 400))));
			cur.newPointsPlayer1 = cur.lastPointsPlayer1 + pointsToAdd;

			if (kEqualForBothPlayers(cur.kBasePlayer1, cur.kBasePlayer2)) {
				cur.newPointsPlayer2 = cur.lastPointsPlayer2 - pointsToAdd;
			} else {
				var pointsToLoose = Math.round(pointsToAdd / cur.kBasePlayer1 * cur.kBasePlayer2);
				cur.newPointsPlayer2 = cur.lastPointsPlayer2 - pointsToLoose;
			}
			let data1 = {
				championshipId: cur.championshipId,
				userId: cur.player1,
				newPoints: cur.newPointsPlayer1
			};
			let data2 = {
				championshipId: cur.championshipId,
				userId: cur.player2,
				newPoints: cur.newPointsPlayer2
			};

			Meteor.call('addPointsForPlayerInChampionship', data1);
			Meteor.call('addPointsForPlayerInChampionship', data2);

			Games.update({ _id: cur._id }, {
				$set: {
					lastPointsPlayer1: cur.lastPointsPlayer1,
					lastPointsPlayer2: cur.lastPointsPlayer2,
					kBasePlayer1: cur.kBasePlayer1,
					kBasePlayer2: cur.kBasePlayer2,
					newPointsPlayer1: cur.newPointsPlayer1,
					newPointsPlayer2: cur.newPointsPlayer2
				}
			});
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
