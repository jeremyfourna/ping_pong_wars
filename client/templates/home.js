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
	player1List() {
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
				console.log(x);
				return x;
			}),
			true);
		console.log(list);
		for (var i = 0; i < list.length; i++) {
			var j = list.shift();
			list.push({
				fullName: j
			});
		}
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
