import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { Bert } from 'meteor/themeteorchef:bert';
import 'meteor/sacha:spin';

import { Championships } from '../../../api/championships/schema.js';

import './editChampionship.jade';

Template.editChampionship.onCreated(function() {
	this.autorun(() => {
		this.subscribe('aChampionshipForEdition', Router.current().params._id);
	});
});

Template.editChampionship.helpers({
	champData() {
		return Championships.findOne({ _id: Router.current().params._id });
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
	}
});
