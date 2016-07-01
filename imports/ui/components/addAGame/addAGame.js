import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { Bert } from 'meteor/themeteorchef:bert';
import { lodash } from 'meteor/stevezhu:lodash';
import { ReactiveVar } from 'meteor/reactive-var';
import 'meteor/sacha:spin';

import { Championships } from '../../../api/championships/schema.js';

import './addAGame.jade';

Template.addAGame.onCreated(function() {
	this.autorun(() => {
		this.subscribe('allUsersForAChampionship', Router.current().params._id);
		this.subscribe('aChampionshipForAddingAGame', Router.current().params._id);
	});
});


Template.addAGame.helpers({
	players() {
		return Meteor.users.find({ 'profile.championships': Router.current().params._id }, {
			fields: {
				'profile.fullName': 1
			},
			sort: {
				'profile.fullName': 1
			}
		});
	},
	playerInChampionship() {
		if (lodash.includes(Meteor.user().profile.championships, Router.current().params._id)) {
			return true;
		} else {
			return false;
		}
	}
});

Template.addAGame.events({
	'click #addAGame': function(event) {
		event.preventDefault();

		function getMinPointsToWin() {
			return Championships.findOne({ _id: Router.current().params._id }, {
				fields: {
					minPointsToWin: 1
				}
			});
		}

		function saveBegin() {
			$('#addAGame').remove();
			Blaze.render(Template.progressBar, $('#buttonOrProgressBar').get(0));
		}

		function saveEnd() {
			$('.progress').remove();
			Blaze.render(Template.validateButton, $('#buttonOrProgressBar').get(0));
		}

		function cleanForm() {
			$('.has-feedback').removeClass('has-success');
			$('.has-feedback').removeClass('has-warning');
			$('.has-feedback').removeClass('has-error');
			$('.saveAGame').find('span').remove();
			$('.has-feedback').find('span').remove();
		}

		function addValidation(template, element, state) {
			if (!element.hasClass('has-warning') && !element.hasClass('has-error') && !element.hasClass('has-success')) {
				element.addClass(state);
				Blaze.render(template, element.get(0));
			}
		}

		function addValidationWithData(template, data, element, state) {
			if (!element.hasClass('has-warning') && !element.hasClass('has-error') && !element.hasClass('has-success')) {
				element.addClass(state);
				Blaze.renderWithData(template, data, element.get(0));
			}
		}

		function playerInChampionship(playerId) {
			let inDb = Meteor.users.findOne({
				_id: playerId,
				'profile.championships': Router.current().params._id
			}, {
				fields: { _id: 1 }
			});
			if (inDb) {
				return true;
			} else {
				return false;
			}
		}

		// Init
		cleanForm();
		saveBegin();
		let player1OK = true;
		let player2OK = true;
		let score = true;
		let pointsToWin = getMinPointsToWin().minPointsToWin;

		const data = {
			player1: $('#player1fullName').val(),
			player2: $('#player2fullName').val(),
			scorePlayer1: Number($('#player1Score').val()),
			scorePlayer2: Number($('#player2Score').val()),
			gameDate: new Date(),
			addedBy: Meteor.userId(),
			championshipId: Router.current().params._id
		};

		if (data.player1 === 'default' || !data.player1) {
			player1OK = false;
			addValidation(Template.playerNotDefined, $('.player1fullName'), 'has-error');
		}
		if (data.player2 === 'default' || !data.player2) {
			player2OK = false;
			addValidation(Template.playerNotDefined, $('.player2fullName'), 'has-error');
		}
		if ($('#player1Score').val() === '' || data.scorePlayer1 < 0) {
			score = false;
			addValidation(Template.scoreNotDefined, $('.player1Score'), 'has-error');
		}
		if ($('#player2Score').val() === '' || data.scorePlayer2 < 0) {
			score = false;
			addValidation(Template.scoreNotDefined, $('.player2Score'), 'has-error');
		}
		if (data.scorePlayer1 < pointsToWin && data.scorePlayer2 < pointsToWin) {
			score = false;
			addValidationWithData(Template.minToWin, getMinPointsToWin(), $('.player1Score'), 'has-warning');
			addValidationWithData(Template.minToWin, getMinPointsToWin(), $('.player2Score'), 'has-warning');
		}
		if (data.player1 === data.player2) {
			player1OK = false;
			player2OK = false;
			addValidation(Template.bothPlayersEqual, $('.player1fullName'), 'has-warning');
			addValidation(Template.bothPlayersEqual, $('.player2fullName'), 'has-warning');
		}
		if (data.scorePlayer1 === data.scorePlayer2) {
			score = false;
			addValidation(Template.bothScoresEqual, $('.player1Score'), 'has-warning');
			addValidation(Template.bothScoresEqual, $('.player2Score'), 'has-warning');
		}
		if (!playerInChampionship(data.player1)) {
			player1OK = false;
			addValidation(Template.playerNotInDb, $('.player1fullName'), 'has-error');
		}
		if (!playerInChampionship(data.player2)) {
			player2OK = false;
			addValidation(Template.playerNotInDb, $('.player2fullName'), 'has-error');
		}
		if (player1OK) {
			addValidation(Template.fieldOK, $('.player1fullName'), 'has-success');
		}
		if (player2OK) {
			addValidation(Template.fieldOK, $('.player2fullName'), 'has-success');
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
		if (data.scorePlayer1 < data.scorePlayer2) {
			data.player1 = $('#player2fullName').val();
			data.player2 = $('#player1fullName').val();
			data.scorePlayer1 = Number($('#player2Score').val());
			data.scorePlayer2 = Number($('#player1Score').val());
		}

		Meteor.call('addAChampionshipGame', data, (error, result) => {
			if (error) {
				return Bert.alert(error.message, 'danger', 'growl-top-right');
			} else {
				$('input').val('');
				$('select').val('default');
				cleanForm();
				saveEnd();
			}
		});
	},
	'click #integrateChampionship': function(event) {
		event.preventDefault();
		const data = {
			userId: Meteor.userId(),
			championshipId: Router.current().params._id
		};
		let champData = Championships.findOne({ _id: Router.current().params._id }, {
			fields: {
				players: 1
			}
		});
		if (lodash.findIndex(champData.players, ['playerId', data.userId]) === -1) {
			Meteor.call('addPlayerInChampionship', data, (error, result) => {
				if (error) {
					return Bert.alert(error.message, 'danger', 'growl-top-right');
				}
			});
		} else {
			Meteor.call('addChampionshipIntoProfile', data, (error, result) => {
				if (error) {
					return Bert.alert(error.message, 'danger', 'growl-top-right');
				}
			});
		}
	}
});
