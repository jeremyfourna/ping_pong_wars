var subscriptions = new SubsManager();

Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	notFoundTemplate: 'notFound'
});

Router.route('/', {
	name: 'home',
	waitOn: function() {
		return [subscriptions.subscribe('lastGames'), subscriptions.subscribe('allUsers')];
	},
	fastRender: true
});

Router.route('/ranking', {
	name: 'rankingWrapper',
	waitOn: function() {
		return subscriptions.subscribe('allUsers');
	},
	data: function() {
		return Meteor.users.find({}, {
			fields: {
				'profile.firstName': 1,
				'profile.lastName': 1,
				'profile.points': 1
			}
		});
	},
	fastRender: true
});

Router.route('/championship', {
	name: 'ChampionshipWrapper',
	/*waitOn: function() {
		return subscriptions.subscribe('');
	},*/
	fastRender: true
});

Router.route('/search', {
	name: 'search',
	/*waitOn: function() {
		return subscriptions.subscribe('');
	},*/
	fastRender: true
});

Router.route('/account', {
	name: 'accountWrapper',
	fastRender: true
});
