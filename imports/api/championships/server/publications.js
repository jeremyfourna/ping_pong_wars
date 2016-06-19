import { Meteor } from 'meteor/meteor';

import { Championships } from '../schema.js';

Meteor.publish('aChampionship', (championshipId) => {
	check(championshipId, String);
	return Championships.find({ _id: championshipId });
});

Meteor.publish('aChampionshipForEdition', (championshipId) => {
	check(championshipId, String);
	return Championships.find({ _id: championshipId }, {
		fields: {
			name: 1,
			public: 1,
			minPointsToWin: 1,
			numberOfSetsToPlay: 1,
			numberOfGamesToBeDisplayedInTheRanking: 1,
			numberOfResultsToBeDisplayedInTheGraph: 1
		}
	});
});

Meteor.publish('allChampionships', () => {
	return Championships.find({}, {
		fields: {
			name: 1,
			public: 1,
			players: 1,
		},
		sort: {
			name: 1
		}
	});
});

Meteor.publish('championshipsForUser', (userId) => {
	return Championships.find({ 'players.playerId': userId });
});
