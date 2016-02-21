Template.home.helpers({
	lastGames() {
		return Games.find({}, {
			sort: {
				gameDate: -1
			},
			limit: 12
		});
	},
	smallScoreGap() {
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
	},
	playerList() {
		var list = _.uniq(Meteor.users.find({}, {
			sort: {
				'profile.firstName': 1,
				'profile.lastName': 1
			},
			fields: {
				'_id': 1,
				'profile.firstName': 1,
				'profile.lastName': 1
			}
		}).fetch().map(function(x) {
			return x;
		}), true);
		list.sort(function(a, b) {
			if (a.fullName > b.fullName) {
				return 1;
			}
			if (a.fullName < b.fullName) {
				return -1;
			}
			return 0;
		});
		return list;
	}
});

Template.home.events({
	'click #addAGame': function(e) {
		e.preventDefault();
		if ($('#player1Name').val() === '' || $('#player2Name').val() === '') {
			console.log($('#player1Name').val(), $('#player1Score').val(), $('#player2Name').val(), $('#player1Score').val());
			return throwError("The both players are not defined !");
		}
	}
});
