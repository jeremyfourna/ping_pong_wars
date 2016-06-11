Template.header.helpers({});

Template.header.events({
	'click .route': function() {
		if ($('#navigation').hasClass('in')) {
			$('#navigation').removeClass('in');
		}
	},
	'click .navbar-brand': function() {
		if ($('#navigation').hasClass('in')) {
			$('#navigation').removeClass('in');
		}
	}
});
