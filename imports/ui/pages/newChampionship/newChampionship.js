import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Bert } from 'meteor/themeteorchef:bert';
import { Router } from 'meteor/iron:router';
import { lodash } from 'meteor/stevezhu:lodash';
import { ReactiveField } from 'meteor/peerlibrary:reactive-field';

import { Championships } from '../../../api/championships/schema.js';

import './newChampionship.jade';

Template.newChampionship.onCreated(function() {
	this.autorun(() => {
		this.subscribe('allUsers');
	});
});

Template.newChampionship.onRendered(function() {
	this.playersToAdd = new ReactiveField([]);
});

Template.newChampionship.helpers({
	allUsers() {
		return Meteor.users.find({}, {
			fields: {
				'profile.fullName': 1
			},
			sort: {
				'profile.fullName': 1
			}
		});
	}
});

Template.newChampionship.events({
	'click .addPlayer': function(event, template) {
		event.preventDefault();
		let data = Template.instance().playersToAdd();
		data.push(this._id);
		Template.instance().playersToAdd(data);
		$('#playerAdd_' + this._id).addClass('hide');
		$('#playerRemove_' + this._id).removeClass('hide');
	},
	'click .removePlayer': function(event, template) {
		event.preventDefault();
		let data = Template.instance().playersToAdd();
		lodash.pull(data, this._id);
		Template.instance().playersToAdd(data);
		$('#playerRemove_' + this._id).addClass('hide');
		$('#playerAdd_' + this._id).removeClass('hide');
	},
	'click #createChampionship': function(event) {
		event.preventDefault();
		const data = {
			userId: Meteor.userId(),
			name: $('#championshipName').val(),
			minPointsToWin: Number($('#championshipMinPointsToWin').val()),
			numberOfSetsToPlay: Number($('#championshipNumberOfSetsToPlay').val()),
			numberOfGamesToBeDisplayedInTheRanking: Number($('#championshipNumberOfGamesToBeDisplayedInTheRanking').val()),
			numberOfResultsToBeDisplayedInTheGraph: Number($('#championshipNumberOfResultsToBeDisplayedInTheGraph').val()),
			playersToAdd: Template.instance().playersToAdd()
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
		Meteor.call('createChampionship', data, (error, result) => {
			if (error) {
				return Bert.alert(error.message, 'danger', 'growl-top-right');
			} else {
				Router.go('championship', { _id: result });
			}
		});
	}
});
