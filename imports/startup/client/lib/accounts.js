import { Accounts } from 'meteor/accounts-base';
import { Router } from 'meteor/iron:router';

Accounts.onLogin(function() {
	if ($('#navigation').hasClass('in')) {
		$('#navigation').removeClass('in');
	}
	if (!Meteor.user().profile.firstName || !Meteor.user().profile.lastName) {
		Router.go('account');
	}
});
