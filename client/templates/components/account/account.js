class UserAccount extends BlazeComponent {
	template() {
		return 'account';
	}

	onRendered() {
		super.onRendered();

		if (!Meteor.userId()) {
			Router.go('home');
		}
		var freshData = Meteor.users.find({ _id: Meteor.userId() }, {
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
			bindto: '#userRankingGraph',
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
				},
				x: {
					label: {
						text: 'Vos matchs',
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
	}

	userData() {
		return Meteor.user();
	}

	userHasPlayed() {
		return Meteor.user().hasPlayed();
	}

	events() {
		return super.events().concat({
			'click #saveUser': this.updateUserData
		});
	}

	lastGames() {
		return Games.find({
			$or: [{ player1: Meteor.userId() }, { player2: Meteor.userId() }]
		}, {
			sort: {
				gameDate: -1
			}
		});
	}

	panelClass() {
		if (this.currentData().player1 === Meteor.userId()) {
			return 'panel-success';
		} else {
			return 'panel-danger';
		}
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
