Meteor.publish('lastGames', function() {
	return Games.find({}, {
		sort: {
			gameDate: -1
		},
		limit: 10
	});
});
