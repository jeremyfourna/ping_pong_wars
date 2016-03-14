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

	saveAGame(event) {
		var self = this;
		event.preventDefault();
		this.cleanForm();
		this.saveBegin();
		var player1OK = true;
		var player2OK = true;
		var score = true;
		if ($('#player1Name').val() === '') {
			player1OK = false;
			this.addValidation(Template.playerNotDefined, $('.player1Name'), 'has-error');
		}
		if ($('#player2Name').val() === '') {
			player2OK = false;
			this.addValidation(Template.playerNotDefined, $('.player2Name'), 'has-error');
		}
		if (Number($('#player1Score').val()) < 10 && Number($('#player2Score').val()) < 10) {
			score = false;
			this.addValidation(Template.minToWin, $('.player1Score'), 'has-warning');
			this.addValidation(Template.minToWin, $('.player2Score'), 'has-warning');
		}
		if ($('#player1Score').val() === '') {
			score = false;
			this.addValidation(Template.scoreNotDefined, $('.player1Score'), 'has-error');
		}
		if ($('#player2Score').val() === '') {
			score = false;
			this.addValidation(Template.scoreNotDefined, $('.player2Score'), 'has-error');
		}
		if ($('#player1Name').val() === $('#player2Name').val()) {
			player1OK = false;
			player2OK = false;
			this.addValidation(Template.bothPlayersEqual, $('.player1Name'), 'has-warning');
			this.addValidation(Template.bothPlayersEqual, $('.player2Name'), 'has-warning');
		}
		if (Number($('#player1Score').val()) === Number($('#player2Score').val())) {
			score = false;
			this.addValidation(Template.bothScoresEqual, $('.player1Score'), 'has-warning');
			this.addValidation(Template.bothScoresEqual, $('.player2Score'), 'has-warning');
		}
		if (Router.current().url.match('championship')) {
			if (!this.playerInChampionship($('#player1Name').val())) {
				player1OK = false;
				this.addValidation(Template.playerNotInDb, $('.player1Name'), 'has-error');
			}
			if (!this.playerInChampionship($('#player2Name').val())) {
				player2OK = false;
				this.addValidation(Template.playerNotInDb, $('.player2Name'), 'has-error');
			}
		}
		if (!player1OK) {
			return this.saveEnd();
		}
		if (!player2OK) {
			return this.saveEnd();
		}
		if (!score) {
			return this.saveEnd();
		}
		var game = {
			gameDate: new Date(),
			addedBy: Meteor.userId()
		};
		if (Number($('#player1Score').val()) < Number($('#player2Score').val())) {
			game.player1 = this.playerInChampionship($('#player1Name').val());
			game.player2 = this.playerInChampionship($('#player2Name').val());
			game.scorePlayer1 = Number($('#player2Score').val());
			game.scorePlayer2 = Number($('#player1Score').val());
		} else {
			game.player1 = this.playerInChampionship($('#player1Name').val());
			game.player2 = this.playerInChampionship($('#player2Name').val());
			game.scorePlayer1 = Number($('#player1Score').val());
			game.scorePlayer2 = Number($('#player2Score').val());
		}
		if (Router.current().url.match('championship')) {
			game.championshipId = Router.current().params._id;
			Meteor.call('addAChampionshipGame', game, function(error, result) {
				if (error) {
					return throwError(error.message);
				} else {
					$('input').val('');
					self.saveEnd();
				}
			});
		}
	}

	saveBegin() {
		$('#addAGame').remove();
		Blaze.render(Template.progressBar, $('#buttonOrProgressBar').get(0));
	}

	saveEnd() {
		$('.progress').remove();
		Blaze.render(Template.validateButton, $('#buttonOrProgressBar').get(0));
	}

	cleanForm() {
		$('.has-feedback').removeClass('has-success');
		$('.has-feedback').removeClass('has-warning');
		$('.has-feedback').removeClass('has-error');
		$('.saveAGame').find('span').remove();
	}

	addValidation(template, element, state) {
		element.addClass(state);
		Blaze.render(template, element.get(0));
	}

	playerInChampionship(playerName) {
		var playerNameArray = $('#player1Name').val().split(' ');
		var inDb = Meteor.users.findOne({
			$and: [
				{ 'profile.firstName': playerNameArray[0] },
				{ 'profile.lastName': playerNameArray[1] }
			],
			'profile.championships': Router.current().params._id
		}, {
			fields: { _id: 1 }
		});
		if (inDb) {
			return inDb._id;
		} else {
			return false;
		}
	}

	playerList() {
		var list = lodash.uniq(Meteor.users.find({ 'profile.championships': Router.current().params._id }, {
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
