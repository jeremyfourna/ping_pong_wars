import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Games } from '../games/schema.js';
import { worldPointsForAGame } from '../../startup/sharedFunctions.js';

Meteor.methods({
	updateUserData(data) {
		let methodSchema = new SimpleSchema({
			firstName: { type: String },
			lastName: { type: String },
			userId: { type: String }
		});
		check(data, methodSchema);
		return Meteor.users.update({ _id: data.userId }, {
			$set: {
				'profile.firstName': data.firstName,
				'profile.lastName': data.lastName,
				'profile.fullName': data.firstName + ' ' + data.lastName
			}
		});
	},
	addChampionshipIntoProfile(data) {
		let methodSchema = new SimpleSchema({
			userId: { type: String },
			championshipId: { type: String }
		});
		check(data, methodSchema);
		return Meteor.users.update({ _id: data.userId }, {
			$push: {
				'profile.championships': data.championshipId
			}
		});
	},
	resetWorldPoints() {
		return Meteor.users.update({}, {
			$set: {
				'profile.worldPoints': 0
			}
		}, { multi: true });
	},
	updateWorldPoints(data) {
		let methodSchema = new SimpleSchema({
			playerId: { type: String },
			pointsToAdd: { type: Number }
		});
		check(data, methodSchema);
		return Meteor.users.update({ _id: data.playerId }, {
			$inc: {
				'profile.worldPoints': data.pointsToAdd
			}
		});
	},
	refreshWorldPoints() {
		Meteor.call('resetWorldPoints');
		let allGames = Games.find({}).fetch();
		allGames.map((cur, index, array) => {
			let pointsForPlayer1 = 5;
			let pointsForPlayer2 = 1;
			pointsForPlayer1 += worldPointsForAGame(cur.scorePlayer1, cur.scorePlayer2).win;
			pointsForPlayer2 += worldPointsForAGame(cur.scorePlayer1, cur.scorePlayer2).loose;
			let player1 = {
				playerId: cur.player1,
				pointsToAdd: pointsForPlayer1
			};
			let player2 = {
				playerId: cur.player2,
				pointsToAdd: pointsForPlayer2
			};
			Meteor.call('updateWorldPoints', player1);
			Meteor.call('updateWorldPoints', player2);
		});
	}
});
