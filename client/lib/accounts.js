Accounts.onLogin(function() {
	if (Meteor.user().profile.firstName === '' || Meteor.user().profile.lastName === '') {
		Router.go('account');
	}
})
