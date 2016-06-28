import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { lodash } from 'meteor/stevezhu:lodash';

import { Games } from './schema.js';
import { Championships } from '../championships/schema.js';
import { pointBase, pointsDifference, kEqualForBothPlayers } from '../../startup/sharedFunctions.js';

Meteor.methods({
	addAChampionshipGame(data) {
		let methodSchema = new SimpleSchema({
			player1: { type: String },
			player2: { type: String },
			scorePlayer1: { type: Number },
			scorePlayer2: { type: Number },
			addedBy: { type: String },
			championshipId: { type: String },
			gameDate: { type: Date }
		});
		check(data, methodSchema);
		let champData = Championships.findOne({ _id: data.championshipId });
		let ind1 = lodash.findIndex(champData.players, ['playerId', data.player1]);
		let ind2 = lodash.findIndex(champData.players, ['playerId', data.player2]);
		data.lastPointsPlayer1 = lodash.last(champData.players[ind1].points);
		data.lastPointsPlayer2 = lodash.last(champData.players[ind2].points);
		data.kBasePlayer1 = pointBase(champData.players[ind1].points.length, data.lastPointsPlayer1);
		data.kBasePlayer2 = pointBase(champData.players[ind2].points.length, data.lastPointsPlayer2);
		let pointsToAdd = Math.round(data.kBasePlayer1 * (1 / (1 + Math.pow(10, pointsDifference(data.lastPointsPlayer1, data.lastPointsPlayer2) / 400))));
		data.newPointsPlayer1 = data.lastPointsPlayer1 + pointsToAdd;

		if (kEqualForBothPlayers(data.kBasePlayer1, data.kBasePlayer2)) {
			data.newPointsPlayer2 = data.lastPointsPlayer2 - pointsToAdd;
		} else {
			let pointsToLoose = Math.round(pointsToAdd / data.kBasePlayer1 * data.kBasePlayer2);
			data.newPointsPlayer2 = data.lastPointsPlayer2 - pointsToLoose;
		}
		let data1 = {
			championshipId: data.championshipId,
			userId: data.player1,
			newPoints: data.newPointsPlayer1
		};
		let data2 = {
			championshipId: data.championshipId,
			userId: data.player2,
			newPoints: data.newPointsPlayer2
		};
		Meteor.call('addPointsForPlayerInChampionship', data1);
		Meteor.call('addPointsForPlayerInChampionship', data2);

		// Insert game Object in the Games collection
		return Games.insert(data);
	},
	cleanGamesCollection() {
		// Method to clean the Games collection, all games must have player1 have winner
		let allGames = Games.find({}).fetch();
		// Loop on each game to see if the player2 is the winner
		allGames.map((cur, index, array) => {
			if (cur.scorePlayer1 < cur.scorePlayer2) {
				Games.update({ _id: cur._id }, {
					$set: {
						player1: cur.player2,
						player2: cur.player1,
						scorePlayer1: cur.scorePlayer2,
						scorePlayer2: cur.scorePlayer1,
						lastPointsPlayer1: cur.lastPointsPlayer2,
						lastPointsPlayer2: cur.lastPointsPlayer1,
						kBasePlayer1: cur.kBasePlayer2,
						kBasePlayer2: cur.kBasePlayer1,
						newPointsPlayer1: cur.newPointsPlayer2,
						newPointsPlayer2: cur.newPointsPlayer1
					}
				});
			}
		});
	},
	updateAGame(data) {
		let methodSchema = new SimpleSchema({
			gameId: { type: String },
			lastPointsPlayer1: { type: Number },
			lastPointsPlayer2: { type: Number },
			kBasePlayer1: { type: Number },
			kBasePlayer2: { type: Number },
			newPointsPlayer1: { type: Number },
			newPointsPlayer2: { type: Number }
		});
		check(data, methodSchema);
		return Games.update({ _id: data.gameId }, {
			$set: {
				lastPointsPlayer1: data.lastPointsPlayer1,
				lastPointsPlayer2: data.lastPointsPlayer2,
				kBasePlayer1: data.kBasePlayer1,
				kBasePlayer2: data.kBasePlayer2,
				newPointsPlayer1: data.newPointsPlayer1,
				newPointsPlayer2: data.newPointsPlayer2
			}
		});
	}
});
