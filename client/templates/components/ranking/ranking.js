class Ranking extends BlazeComponent {
	template() {
		return 'ranking';
	}

	onRendered() {
		var freshData = Meteor.users.find({}, {
			fields: {
				'profile.firstName': 1,
				'profile.lastName': 1,
				'profile.points': 1
			}
		}).fetch();
		var userData = [];
		for (var i = 0; i < freshData.length; i++) {
			var list = [];
			list.push(freshData[i].fullName());
			list = list.concat(freshData[i].profile.points);
			userData.push(list);
		}
		var chart = c3.generate({
			bindto: '#rankingGraph',
			data: {
				type: 'line',
				columns: userData
			},
		});
		chart.load({
			columns: userData
		});
		$('tbody tr:nth-child(-n+3)').addClass('success');
		$('tbody tr:nth-last-child(-n+3)').addClass('danger');
	}

	playerData() {
		var freshData = Meteor.users.find({}, {
			fields: {
				'profile.firstName': 1,
				'profile.lastName': 1,
				'profile.points': 1,
			}
		}).fetch();
		freshData.sort(function(a, b) {
			if (a.average() > b.average()) {
				return -1;
			}
			if (a.average() < b.average()) {
				return 1;
			}
			return 0;
		});
		return freshData;
	}

	index() {
		return this.currentData('@index') + 1;
	}
}

Ranking.register('Ranking');
