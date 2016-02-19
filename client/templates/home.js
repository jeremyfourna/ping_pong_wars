Template.home.helpers({
	lastGames() {
		return Games.find({}, {
			sort: {
				gameDate: -1
			},
			limit: 12
		});
	},
	smallScoreGap() {;
		if (this.scoreGap() === 2) {
			return true;
		} else {
			return false;
		}
	},
	bigScoreGap() {
		if (this.scoreGap() > 5) {
			return true;
		} else {
			return false;
		}
	}
});
