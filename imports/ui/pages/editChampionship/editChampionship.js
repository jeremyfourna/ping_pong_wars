import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { Bert } from 'meteor/themeteorchef:bert';
import { lodash } from 'meteor/stevezhu:lodash';
import 'meteor/sacha:spin';

import { Championships } from '../../../api/championships/schema.js';

import './editChampionship.jade';

Template.editChampionship.onCreated(function() {
	this.autorun(() => {
		this.subscribe('aChampionshipForEdition', Router.current().params._id);
		this.subscribe('allUsers');
	});
});

Template.editChampionship.helpers({
	champData() {
		return Championships.findOne({ _id: Router.current().params._id });
	},
	allUsersAlreadyIn() {
		return Meteor.users.find({
			'profile.championships': Router.current().params._id
		}, {
			fields: {
				'profile.fullName': 1
			},
			sort: {
				'profile.fullName': 1
			}
		});
	},
	allUsersNotIn() {
		return Meteor.users.find({
			'profile.championships': {
				$nin: [Router.current().params._id]
			}
		}, {
			fields: {
				'profile.fullName': 1
			},
			sort: {
				'profile.fullName': 1
			}
		});
	}
});

Template.editChampionship.events({
	'click #updateChampionship': function(event) {
		event.preventDefault();
		const data = {
			championshipId: Router.current().params._id,
			name: $('#championshipName').val(),
			minPointsToWin: Number($('#championshipMinPointsToWin').val()),
			numberOfSetsToPlay: Number($('#championshipNumberOfSetsToPlay').val()),
			numberOfGamesToBeDisplayedInTheRanking: Number($('#championshipNumberOfGamesToBeDisplayedInTheRanking').val()),
			numberOfResultsToBeDisplayedInTheGraph: Number($('#championshipNumberOfResultsToBeDisplayedInTheGraph').val())
		};
		if ($('input[name="championshipPublic"]:checked').val() === 'yes') {
			data.public = true;
		} else if ($('input[name="championshipPublic"]:checked').val() === 'no') {
			data.public = false;
		}
		if (!data.name) {
			return Bert.alert('You must define a name for the championship', 'danger', 'growl-top-right');
		}
		if (!data.minPointsToWin) {
			return Bert.alert('You must define the minimum number of points to win', 'danger', 'growl-top-right');
		}
		if (!data.numberOfSetsToPlay) {
			return Bert.alert('You must define the number of sets to play', 'danger', 'growl-top-right');
		}
		if (!data.numberOfGamesToBeDisplayedInTheRanking) {
			return Bert.alert('You must define the minimum number of game to be displayed in the ranking', 'danger', 'growl-top-right');
		}
		if (!data.numberOfResultsToBeDisplayedInTheGraph) {
			return Bert.alert('You must define the number of scores to be displayed into the graph', 'danger', 'growl-top-right');
		}
		Meteor.call('updateChampionship', data, (error, result) => {
			if (error) {
				return Bert.alert(error.message, 'danger', 'growl-top-right');
			} else {
				Router.go('championship', { _id: Router.current().params._id });
			}
		});
	},
	'click .removePlayer': function(event) {
		event.preventDefault();
		const data = {
			championshipId: Router.current().params._id,
			userId: this._id
		};
		Meteor.call('removeChampionshipFromProfile', data, (error, result) => {
			if (error) {
				return Bert.alert(error.message, 'danger', 'growl-top-right');
			}
		});
	},
	'click .addPlayer': function(event) {
		event.preventDefault();
		const data = {
			championshipId: Router.current().params._id,
			userId: this._id
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
