var subscriptions = new SubsManager();

Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	notFoundTemplate: 'notFound'
});

Router.route('/', {
	name: 'home',
	fastRender: true
});

Router.route('/championships', {
	name: 'championshipsWrapper',
	waitOn: function() {
		return subscriptions.subscribe('allChampionships');
	},
	fastRender: true
});

Router.route('/championship/new', {
	name: 'createChampionship',
	fastRender: true
});

Router.route('/championship/:_id', {
	name: 'championshipWrapper',
	waitOn: function() {
		return [
			subscriptions.subscribe('aChampionship', this.params._id),
			subscriptions.subscribe('allUsersForAChampionship', this.params._id),
			subscriptions.subscribe('lastGamesForAChampionship', this.params._id)
		];
	},
	fastRender: false
});

Router.route('/championship/game/:_id', {
	name: 'gameDetailsWrapper',
	waitOn: function() {
		return [
			subscriptions.subscribe('aGame', this.params._id),
			subscriptions.subscribe('playersForAGame', this.params._id),
			subscriptions.subscribe('gamesBetweenTwoPlayersInAChampionship', this.params._id)
		];
	},
	fastRender: true
});


Router.route('/championship/:_id/ranking', {
	name: 'rankingWrapper',
	waitOn: function() {
		return [subscriptions.subscribe('allUsersForAChampionship', this.params._id), subscriptions.subscribe('allGamesForAChampionship'), subscriptions.subscribe('aChampionship', this.params._id)];
	},
	fastRender: false
});

Router.route('/account', {
	name: 'accountWrapper',
	waitOn: function() {
		return [subscriptions.subscribe('userGames', Meteor.userId()), subscriptions.subscribe('aUser', Meteor.userId())];
	},
	fastRender: false
});
