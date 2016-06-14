import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { Bert } from 'meteor/themeteorchef:bert';
import { lodash } from 'meteor/stevezhu:lodash';

import { Championships } from '../../../api/championships/schema.js';

import './championship.jade';
import '../../components/addAGame/addAGame.js';
import '../../components/ranking/ranking.js';
import '../../components/listLastGames/listLastGames.js';

Template.championship.onCreated(function() {
	this.autorun(() => {
		this.subscribe('aChampionship', Router.current().params._id);
	});
});

Template.championship.helpers({
	championshipData() {
		return Championships.findOne({ _id: Router.current().params._id }, {
			fields: {
				name: 1
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

Template.championship.events({
	'click #integrateChampionship': function(event) {
		event.preventDefault();
		const data = {
			userId: Meteor.userId(),
			championshipId: Router.current().params._id
		};
		Meteor.call('addPlayerInChampionship', data, (error, result) => {
			if (error) {
				return Bert.alert(error.message, 'danger', 'growl-top-right');
			}
		});
	}
});
