import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Random } from 'meteor/random';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Championships } from './schema.js';
import { pointBase, pointsDifference } from '../../startup/sharedFunctions.js';

Meteor.methods({
	createChampionship(data) {
		let methodSchema = new SimpleSchema({
			userId: { type: String },
			name: { type: String },
			publicOrPrivate: { type: Boolean }
		});
		let newData = {
			userId: data.userId
		};
		check(data, methodSchema);
		data._id = Random.id();
		newData.championshipId = data._id;

		Championships.insert({
			_id: data._id,
			name: data.name,
			players: [{
				playerId: data.userId,
				points: [1500]
			}],
			createdAt: new Date(),
			createdBy: data.userId,
			public: data.publicOrPrivate
		});

		Meteor.call('addChampionshipIntoProfile', data);
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
		let allGames = Games.find({ championshipId }, { sort: { gameDate: 1 } }).fetch();
		// Loop on each game to calculate the new points
		allGames.map((cur, index, array) => {
			let champOfTheGame = Championships.findOne({ _id: cur.championshipId }, {
				fields: {
					players: 1
				}
			});
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

			Meteor.call('addPointsForPlayerInChampionship', cur.championshipId, cur.player1, cur.newPointsPlayer1);
			Meteor.call('addPointsForPlayerInChampionship', cur.championshipId, cur.player2, cur.newPointsPlayer2);

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
