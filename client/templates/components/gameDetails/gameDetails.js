class GameDetails extends BlazeComponent {
	template() {
		return 'gameDetails';
	}

	onRendered() {
		super.onRendered();
		var players = Games.findOne({ _id: Router.current().params._id });
		var twoUserData = Meteor.users.find({
			$or: [{ _id: players.player1 }, { _id: players.player2 }]
		}, {
			fields: {
				'profile.firstName': 1,
				'profile.lastName': 1,
				'profile.points': 1,
				_id: 1
			}
		}).fetch();
		var gamesBetweenTwoPlayers = Games.find({
			$or: [{
				$and: [
					{ player1: players.player1 },
					{ player2: players.player2 }
				]
			}, {
				$and: [
					{ player2: players.player1 },
					{ player1: players.player2 }
				]
			}]
		}).fetch();
		var userData = [];
		var gamesData = [
			[twoUserData[0].fullName(), 0],
			[twoUserData[1].fullName(), 0]
		];
		for (var i = 0; i < twoUserData.length; i++) {
			var list = [];
			list.push(twoUserData[i].fullName());
			list = list.concat(twoUserData[i].profile.points);
			userData.push(list);
		}
		for (var j = 0; j < gamesBetweenTwoPlayers.length; j++) {
			if (winner(gamesBetweenTwoPlayers[j]) === twoUserData[0]._id) {
				gamesData[0][1] = gamesData[0][1] + 1;
			} else if (winner(gamesBetweenTwoPlayers[j]) === twoUserData[1]._id) {
				gamesData[1][1] = gamesData[1][1] + 1;
			}
		}
		var chart = c3.generate({
			bindto: '#rankingGraph',
			size: {
				height: 480
			},
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
				}
			},
			grid: {
				y: {
					show: true
				}
			}
		});
		var chart2 = c3.generate({
			bindto: '#historyGraph',
			data: {
				type: 'bar',
				columns: gamesData
			},
			bar: {
				width: {
					ratio: 0.5
				}
			}
		});
		chart.load({
			columns: userData
		});
		chart2.load({
			columns: gamesData
		});

	}

	gameData() {
		return Games.findOne({ _id: Router.current().params._id });
	}

	panelClass() {
		if (this.currentData().over10()) {
			return 'panel-info';
		} else if (this.currentData().scoreGap() === 2) {
			return 'panel-warning';
		} else if (this.currentData().scoreGap() > 5) {
			return 'panel-success';
		} else {
			return 'panel-default';
		}
	}
}

GameDetails.register('GameDetails');
