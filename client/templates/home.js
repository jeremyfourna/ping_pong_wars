Template.home.helpers({
	lastGames() {
		return Games.find({}, {
			sort: {
				gameDate: -1
			},
			limit: 20
		});
	}
});
