import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Bert } from 'meteor/themeteorchef:bert';
import 'meteor/sacha:spin';

import './account.jade';
import '../../components/userPerformance/userPerformance.js';

Template.account.onCreated(function() {
	this.autorun(() => {
		this.subscribe('aUser', Meteor.userId());
	});
});

Template.account.helpers({
	userData() {
		return Meteor.user();
	}
});

Template.account.events({
	'click #saveUser': function(event) {
		event.preventDefault();
		const user = {
			userId: Meteor.userId(),
			firstName: $('#firstName').val(),
			lastName: $('#lastName').val()
		};
		if (!user.firstName) {
			return Bert.alert('First name must be defined !', 'danger', 'growl-top-right');
		} else if (!user.lastName) {
			return Bert.alert('Last name must be defined !', 'danger', 'growl-top-right');
		} else {
			Meteor.call('updateUserData', user, (error, result) => {
				if (error) {
					return Bert.alert(error.message, 'danger', 'growl-top-right');
				} else {
					return Bert.alert('Update successful', 'success', 'growl-top-right');
				}
			});
		}
	}
});
