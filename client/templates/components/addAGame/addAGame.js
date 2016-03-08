class AddAGame extends BlazeComponent {
	template() {
		return 'addAGame';
	}

	onRendered() {
		super.onRendered();
		$(document).on('click', 'input[type=text]', function() { this.select(); });
	}

	events() {
		return super.events().concat({
			'click #addAGame': this.saveAGame
		});
	}

	saveAGame(e) {
		e.preventDefault();
		if ($('#player1Name').val() === '' || $('#player2Name').val() === '') {
			return throwError('The both players are not defined !');
		} else if (Number($('#player1Score').val()) < 10 && Number($('#player2Score').val()) < 10) {
			return throwError('The minimum to win a game is 10 !');
		} else if ($('#player1Score').val() === '' || $('#player2Score').val() === '') {
			return throwError('Both scores must be defined !');
		} else if ($('#player1Name').val() === $('#player2Name').val()) {
			return throwError('Player 1 and Player 2 can\'t play against each other !');
		} else if (Number($('#player1Score').val()) === Number($('#player2Score').val())) {
			return throwError('Both scores can\'t be equal !');
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
					gameDate: new Date(),
					addedBy: Meteor.userId()
				};
				if (Number($('#player1Score').val()) < Number($('#player2Score').val())) {
					game.player1 = player2._id;
					game.player2 = player1._id;
					game.scorePlayer1 = Number($('#player2Score').val());
					game.scorePlayer2 = Number($('#player1Score').val());
				} else {
					game.player1 = player1._id;
					game.player2 = player2._id;
					game.scorePlayer1 = Number($('#player1Score').val());
					game.scorePlayer2 = Number($('#player2Score').val());
				}
				Meteor.call('addAGame', game, function(error, result) {
					if (error) {
						return throwError(error.message);
					} else {
						$('input').val('');
						return throwError('Another one bite the dust !');
					}
				});
			}
		}
	}

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
			} else if (a.fullName < b.fullName) {
				return -1;
			} else {
				return 0;
			}
		});
		return list;
	}
}

AddAGame.register('AddAGame');
