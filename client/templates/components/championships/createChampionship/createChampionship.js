Template.createChampionship.helpers({});

Template.createChampionship.events({
	'click #createChampionship': function(e) {
		e.preventDefault();
		if ($('#championshipName').val()) {
			Meteor.call('createChampionship', Meteor.userId(), $('#championshipName').val(), true, function(error, result) {
				if (error) {
					return throwError(error.message);
				} else {
					Router.go('championshipWrapper', { _id: result });
				}
			});
		}
	}
});
