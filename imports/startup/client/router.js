import { Router } from 'meteor/iron:router';
import { loading } from 'meteor/sacha:spin';

// Base components/layouts
import '../../ui/layouts/layout.js';
import '../../ui/components/loading.jade';
import '../../ui/components/notFound.jade';

// Pages
import '../../ui/pages/home/home.js';
import '../../ui/pages/listChampionships/listChampionships.js';
import '../../ui/pages/newChampionship/newChampionship.js';
import '../../ui/pages/championship/championship.js';

Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	notFoundTemplate: 'notFound'
});

Router.route('/', {
	name: 'home'
});

Router.route('/championships', {
	name: 'listChampionships'
});

Router.route('/championship/new', {
	name: 'newChampionship'
});

Router.route('/championship/:_id', {
	name: 'championship'
});

Router.route('/championship/game/:_id', {
	name: 'gameDetails'
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
