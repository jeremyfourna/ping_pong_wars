import { Meteor } from 'meteor/meteor';

import { Championships } from '../schema.js';

Meteor.publish('aChampionship', (championshipId) => {
	check(championshipId, String);
	return Championships.find({ _id: championshipId });
});

Meteor.publish('allChampionships', () => {
	return Championships.find({}, {
		fields: {
			name: 1,
			public: 1,
			_id: 1
		},
		sort: {
			name: 1
		}
	});
});

Meteor.publish('championshipsForUser', (userId) => {
	return Championships.find({ 'players.playerId': userId });
});
