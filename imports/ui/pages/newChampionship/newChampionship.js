import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Bert } from 'meteor/themeteorchef:bert';
import { Router } from 'meteor/iron:router';

import { Championships } from '../../../api/championships/schema.js';

import './newChampionship.jade';

Template.newChampionship.events({
	'click #createChampionship': function(event) {
		event.preventDefault();
		const data = {
			userId: Meteor.userId(),
			name: $('#championshipName').val(),
			public: true
		};
		if (!data.name) {
			return Bert.alert('You must define a name for the championship', 'danger', 'growl-top-right');
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
