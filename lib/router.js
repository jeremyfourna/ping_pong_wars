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

Router.route('/game/:_id', {
	name: 'gameDetailsWrapper',
	waitOn: function() {
		return [
			subscriptions.subscribe('aGame', this.params._id),
			subscriptions.subscribe('playersForAGame', this.params._id),
			subscriptions.subscribe('gamesBetweenTwoPlayers', this.params._id)
		];
	},
	fastRender: true
});

Router.route('/ranking', {
	name: 'rankingWrapper',
	waitOn: function() {
		return [subscriptions.subscribe('allUsers'), subscriptions.subscribe('allGames')];
	},
	fastRender: false
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
	waitOn: function() {
		return [subscriptions.subscribe('userGames', Meteor.userId()), subscriptions.subscribe('allUsers')];
	},
	fastRender: false
});
