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
	waitOn() {
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
	waitOn() {
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
	waitOn() {
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
	waitOn() {
		return [subscriptions.subscribe('allUsersForAChampionship', this.params._id), subscriptions.subscribe('allGamesForAChampionship'), subscriptions.subscribe('aChampionship', this.params._id)];
	},
	fastRender: false
});

Router.route('/account', {
	name: 'accountWrapper',
	waitOn() {
		return [
			subscriptions.subscribe('aUser', Meteor.userId()),
			subscriptions.subscribe('championshipsForUser', Meteor.userId())
		];
	},
	onRun() {
		if (!Meteor.userId()) {
			this.redirect('/');
		}
		this.next();
	},
	onRerun() {
		if (!Meteor.userId()) {
			this.redirect('/');
		}
		this.next();
	},
	fastRender: false
});
