import { Meteor } from 'meteor/meteor';

import { Games } from '../../games/schema.js';

Meteor.publish('allUsers', () => {
	return Meteor.users.find({}, {
		fields: {
			'profile.firstName': 1,
			'profile.lastName': 1,
			'profile.fullName': 1
		}
	});
});

Meteor.publish('allUsersForAChampionship', (championshipId) => {
	check(championshipId, String);
	return Meteor.users.find({ 'profile.championships': championshipId }, {
		fields: {
			'profile.firstName': 1,
			'profile.lastName': 1,
			'profile.championships': 1,
			'profile.fullName': 1
		}
	});
});

Meteor.publish('aUser', (userId) => {
	return Meteor.users.find({ _id: userId }, {
		fields: {
			'profile.firstName': 1,
			'profile.lastName': 1,
			'profile.championships': 1,
			'profile.fullName': 1
		}
	});
});

Meteor.publish('playersForAGame', (gameId) => {
	check(gameId, String);
	var players = Games.findOne(gameId);
	return Meteor.users.find({
		$or: [{ _id: players.player1 }, { _id: players.player2 }]
	}, {
		fields: {
			'profile.firstName': 1,
			'profile.lastName': 1,
			'profile.fullName': 1
		}
	});
});

Meteor.publish('allUsersForWorldRanking', () => {
	return Meteor.users.find({}, {
		fields: {
			'profile.worldPoints': 1,
			'profile.fullName': 1
		},
		sort: {
			'profile.worldPoints': -1
		},
		limit: 10
	});
});
