Meteor.users.helpers({
	fullName: function() {
		return this.profile.firstName + ' ' + this.profile.lastName.charAt(0) + '.';
	},
	average: function() {
		var sum = 0;
		var result = 0;
		for (var i = 0; i < this.profile.points.length; i++) {
			sum += this.profile.points[i];
		}
		result = Math.round(sum / this.profile.points.length);
		return result;
	},
	nbGames: function() {
		return this.profile.points.length;
	},
	last10GamesPerf: function() {
		var list = [];
		var first = 0;
		var end = 0;
		if (this.profile.points.length > 9) {
			list = this.profile.points.slice(-10);
			first = list[0];
			end = list[9];
			return end - first;
		} else {
			first = this.profile.points[0];
			end = this.profile.points[this.profile.points.length - 1];
			return end - first;
		}
	},
	last5Games: function() {
		var list = [];
		if (this.profile.points.length > 4) {
			list = this.profile.points.slice(-5);
			return list;
		} else {
			return this.profile.points;
		}
	},
	currentPoints: function() {
		return this.profile.points[this.profile.points.length - 1];
	}
});
