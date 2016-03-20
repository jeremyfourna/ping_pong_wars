class UserAccount extends BlazeComponent {
	template() {
		return 'account';
	}

	onRendered() {
		super.onRendered();

		var chart = c3.generate({
			bindto: '#userRankingGraph',
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
						position: 'outer-middle'
					}
				},
				x: {
					label: {
						text: 'Vos matchs',
						position: 'outer-center'
					}
				}
			},
			grid: {
				y: {
					show: true
				}
			}
		});

		this.autorun(function(tracker) {
			var championships = Championships.find({ 'players.playerId': Meteor.userId() }).fetch();
			var userData = [];
			lodash.each(championships, function(championship) {
				var ind = lodash.findIndex(championship.players, ['playerId', Meteor.userId()]);
				if (ind !== -1) {
					var list = [];
					list.push(championship.name);
					list = list.concat(championship.players[ind].points);
					userData.push(list);
				}
			});
			chart.load({
				columns: userData
			});
		});
	}

	userData() {
		return Meteor.user();
	}

	events() {
		return super.events().concat({
			'click #saveUser': this.updateUserData
		});
	}

	updateUserData(e) {
		e.preventDefault();
		var user = {
			userId: Meteor.userId(),
			firstName: $('#firstName').val(),
			lastName: $('#lastName').val()
		};
		if (!user.firstName) {
			return throwError('First name must be defined !');
		} else if (!user.lastName) {
			return throwError('Last name must be defined !');
		} else {
			Meteor.call('updateUserData', user, function(error, result) {
				if (error) {
					return throwError(error.message);
				} else {
					return throwError('Updated with success');
				}
			});
		}
	}
}

UserAccount.register('UserAccount');
