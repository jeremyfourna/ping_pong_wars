Template.home.helpers({
	lastGames() {
		return Games.find({}, {
			sort: {
				gameDate: -1
			},
			limit: 20
		});
	},
	panelClass() {
		if (this.over10()) {
			return 'panel-info';
		} else if (this.scoreGap() === 2) {
			return 'panel-warning';
		} else if (this.scoreGap() > 5) {
			return 'panel-success';
		} else {
			return 'panel-default';
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
	},
	player2List() {
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
			return throwError('The both players are not defined !');
		} else if ($('#player1Score').val() < 10 && $('#player2Score').val() < 10) {
			return throwError('The minimum to win a game is 10 !');
		} else if ($('#player1Name').val() === $('#player2Name').val()) {
			return throwError('Player 1 and Player 2 can\'t play against each other !');
		} else {
			var player1Names = $('#player1Name').val().split(' ');
			var player2Names = $('#player2Name').val().split(' ');
			var player1 = Meteor.users.findOne({ $and: [{ 'profile.firstName': player1Names[0] }, { 'profile.lastName': player1Names[1] }] });
			var player2 = Meteor.users.findOne({ $and: [{ 'profile.firstName': player2Names[0] }, { 'profile.lastName': player2Names[1] }] });
			if (!player1) {
				return throwError('Player 1 does not exist in the database !');
			} else if (!player2) {
				return throwError('Player 2 does not exist in the database !');
			} else {
				var game = {
					player1: player1._id,
					player2: player2._id,
					gameDate: new Date(),
					scorePlayer1: $('#player1Score').val(),
					scorePlayer2: $('#player2Score').val(),
					addedBy: Meteor.userId()
				};
				Meteor.call('addAGame', game, function(error, result) {
					if (error) {
						return throwError(error.message);
					} else {
						return throwError('Another one bite the dust !');
					}
				});
			}
		}
	}
});
