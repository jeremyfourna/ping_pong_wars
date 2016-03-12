Meteor.publish('aChampionship', function(championshipId) {
	check(championshipId, String);
	return Championships.find({ _id: championshipId });
});

Meteor.publish('allChampionships', function() {
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

Meteor.publish('championshipsForUser', function(userId) {
	return Championships.find({ 'players.playerId': userId });
});
