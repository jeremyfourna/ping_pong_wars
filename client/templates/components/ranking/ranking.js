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
			list = list.concat(freshData[i].last5Games());
			userData.push(list);
		}
		userData.sort(function(a, b) {
			if (a[0] > b[0]) {
				return 1;
			}
			if (a[0] < b[0]) {
				return -1;
			}
			return 0;
		});
		var chart = c3.generate({
			bindto: '#rankingGraph',
			data: {
				type: 'line',
				columns: userData
			},
			axis: {
				y: {
					label: {
						text: 'Points',
						position: 'outer-middle',
					}
				},
				x: {
					label: {
						text: 'Derniers 5 matchs',
						position: 'outer-center',
					}
				}
			},
			grid: {
				y: {
					show: true
				}
			}
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
		var newList = [];
		for (var i = 0; i < freshData.length; i++) {
			if (freshData[i].profile.points.length > 9) {
				newList.push(freshData[i]);
			}
		}
		newList.sort(function(a, b) {
			if (a.currentPoints() > b.currentPoints()) {
				return -1;
			}
			if (a.currentPoints() < b.currentPoints()) {
				return 1;
			}
			return 0;
		});
		return newList;
	}

	index() {
		return this.currentData('@index') + 1;
	}
}

Ranking.register('Ranking');
