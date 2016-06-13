import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';

import './header.jade';

Template.header.events({
	'click .route': function(event) {
		if ($('#navigation').hasClass('in')) {
			$('#navigation').removeClass('in');
		}
	},
	'click .navbar-brand': function(event) {
		if ($('#navigation').hasClass('in')) {
			$('#navigation').removeClass('in');
		}
	}
});
