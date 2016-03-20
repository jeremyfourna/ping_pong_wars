class Ranking extends BlazeComponent {
	template() {
		return 'ranking';
	}

	onRendered() {
		super.onRendered();
		var chart = c3.generate({
			bindto: '#rankingGraph',
			size: {
				height: 480
			},
			data: {
				type: 'line',
				columns: []
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
		$('#championshipRankingTable tbody tr:nth-child(-n+3)').addClass('success');
		$('#championshipRankingTable tbody tr:nth-last-child(-n+3)').addClass('danger');

		this.autorun(function(tracker) {
			var freshData = Meteor.users.find({ 'profile.championships': Router.current().params._id }, {
				fields: {
					'profile.firstName': 1,
					'profile.lastName': 1,
					_id: 1
				}
			}).fetch();
			var champData = Championships.findOne({ _id: Router.current().params._id }, {
				fields: {
					players: 1
				}
			});
			var userData = [];
			lodash.each(freshData, function(player) {
				var list = [];
				var ind = lodash.findIndex(champData.players, ['playerId', player._id]);
				list.push(fullName(player.profile));
				list = list.concat(last5Games(champData.players[ind].points));
				userData.push(list);
			});
			userData.sort(function(a, b) {
				if (a[0] > b[0]) {
					return 1;
				}
				if (a[0] < b[0]) {
					return -1;
				}
				return 0;
			});
			chart.load({
				columns: userData
			});
		});
	}

	playerData() {
		var freshData = Meteor.users.find({ 'profile.championships': Router.current().params._id }, {
			fields: {
				'profile.firstName': 1,
				'profile.lastName': 1,
				'profile.points': 1,
				'_id': 1
			}
		}).fetch();
		var champData = Championships.findOne({ _id: Router.current().params._id }, {
			fields: {
				players: 1
			}
		});
		var newList = [];
		lodash.each(freshData, function(player) {
			var ind = lodash.findIndex(champData.players, ['playerId', player._id]);
			if (champData.players[ind].points.length > 10) {
				player.points = champData.players[ind].points;
				player.fullName = fullName(player.profile);
				player.currentPoints = player.points.pop();
				player.nbGames = player.points.length;
				player.last10GamesPerf = last10GamesPerf(player.points);
				newList.push(player);
			}
		});
		newList.sort(function(a, b) {
			if (a.currentPoints > b.currentPoints) {
				return -1;
			}
			if (a.currentPoints < b.currentPoints) {
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
