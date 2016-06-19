import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { Bert } from 'meteor/themeteorchef:bert';
import { lodash } from 'meteor/stevezhu:lodash';
import 'meteor/sacha:spin';

import './addAGame.jade';

Template.addAGame.onCreated(function() {
	this.autorun(() => {
		this.subscribe('allUsersForAChampionship', Router.current().params._id);
	});
});

Template.addAGame.onRendered(function() {
	$(document).on('click', 'input[type=text]', function() { this.select(); });
});

Template.addAGame.helpers({
	playerInChampionship() {
		if (lodash.includes(Meteor.user().profile.championships, Router.current().params._id)) {
			return true;
		} else {
			return false;
		}
	},
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
		}).fetch().map((cur, index, array) => {
			return cur;
		}), true);
		list.sort((a, b) => {
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
});

Template.addAGame.events({
	'click #addAGame': function(event) {
		event.preventDefault();

		function saveBegin() {
			$('#addAGame').remove();
			Blaze.render(Template.progressBar, $('#buttonOrProgressBar').get(0));
		};

		function saveEnd() {
			$('.progress').remove();
			Blaze.render(Template.validateButton, $('#buttonOrProgressBar').get(0));
		};

		function cleanForm() {
			$('.has-feedback').removeClass('has-success');
			$('.has-feedback').removeClass('has-warning');
			$('.has-feedback').removeClass('has-error');
			$('.saveAGame').find('span').remove();
		};

		function addValidation(template, element, state) {
			if (!element.hasClass('has-warning') && !element.hasClass('has-error') && !element.hasClass('has-success')) {
				element.addClass(state);
				Blaze.render(template, element.get(0));
			}
		};

		function playerInChampionship(playerName) {
			var playerNameArray = playerName.split(' ');
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
		};

		cleanForm();
		saveBegin();
		var player1OK = true;
		var player2OK = true;
		var score = true;
		if ($('#player1Name').val() === '') {
			player1OK = false;
			addValidation(Template.playerNotDefined, $('.player1Name'), 'has-error');
		}
		if ($('#player2Name').val() === '') {
			player2OK = false;
			addValidation(Template.playerNotDefined, $('.player2Name'), 'has-error');
		}
		if ($('#player1Score').val() === '') {
			score = false;
			addValidation(Template.scoreNotDefined, $('.player1Score'), 'has-error');
		}
		if ($('#player2Score').val() === '') {
			score = false;
			addValidation(Template.scoreNotDefined, $('.player2Score'), 'has-error');
		}
		if (Number($('#player1Score').val()) < 10 && Number($('#player2Score').val()) < 10) {
			score = false;
			addValidation(Template.minToWin, $('.player1Score'), 'has-warning');
			addValidation(Template.minToWin, $('.player2Score'), 'has-warning');
		}
		if ($('#player1Name').val() === $('#player2Name').val()) {
			player1OK = false;
			player2OK = false;
			addValidation(Template.bothPlayersEqual, $('.player1Name'), 'has-warning');
			addValidation(Template.bothPlayersEqual, $('.player2Name'), 'has-warning');
		}
		if (Number($('#player1Score').val()) === Number($('#player2Score').val())) {
			score = false;
			addValidation(Template.bothScoresEqual, $('.player1Score'), 'has-warning');
			addValidation(Template.bothScoresEqual, $('.player2Score'), 'has-warning');
		}
		if (Router.current().url.match('championship')) {
			if (!playerInChampionship($('#player1Name').val())) {
				player1OK = false;
				addValidation(Template.playerNotInDb, $('.player1Name'), 'has-error');
			}
			if (!playerInChampionship($('#player2Name').val())) {
				player2OK = false;
				addValidation(Template.playerNotInDb, $('.player2Name'), 'has-error');
			}
		}
		if (player1OK) {
			addValidation(Template.fieldOK, $('.player1Name'), 'has-success');
		}
		if (player2OK) {
			addValidation(Template.fieldOK, $('.player2Name'), 'has-success');
		}
		if (score) {
			addValidation(Template.fieldOK, $('.player1Score'), 'has-success');
			addValidation(Template.fieldOK, $('.player2Score'), 'has-success');
		}
		if (!player1OK) {
			return saveEnd();
		}
		if (!player2OK) {
			return saveEnd();
		}
		if (!score) {
			return saveEnd();
		}
		var game = {
			gameDate: new Date(),
			addedBy: Meteor.userId()
		};
		if (Number($('#player1Score').val()) < Number($('#player2Score').val())) {
			game.player1 = playerInChampionship($('#player2Name').val());
			game.player2 = playerInChampionship($('#player1Name').val());
			game.scorePlayer1 = Number($('#player2Score').val());
			game.scorePlayer2 = Number($('#player1Score').val());
		} else {
			game.player1 = playerInChampionship($('#player1Name').val());
			game.player2 = playerInChampionship($('#player2Name').val());
			game.scorePlayer1 = Number($('#player1Score').val());
			game.scorePlayer2 = Number($('#player2Score').val());
		}
		game.championshipId = Router.current().params._id;
		Meteor.call('addAChampionshipGame', game, (error, result) => {
			if (error) {
				return Bert.alert(error.message, 'danger', 'growl-top-right');
			} else {
				$('input').val('');
				cleanForm();
				saveEnd();
			}
		});
	}
});
