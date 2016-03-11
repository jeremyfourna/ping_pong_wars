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
		}
	});
});
