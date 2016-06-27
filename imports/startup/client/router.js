import { Router } from 'meteor/iron:router';

// Base components/layouts
import '../../ui/layouts/layout.js';
import '../../ui/components/notFound.jade';

// Pages
import '../../ui/pages/home/home.js';
import '../../ui/pages/listChampionships/listChampionships.js';
import '../../ui/pages/newChampionship/newChampionship.js';
import '../../ui/pages/championship/championship.js';
import '../../ui/pages/account/account.js';
import '../../ui/pages/gameDetails/gameDetails.js';
import '../../ui/pages/editChampionship/editChampionship.js';

Router.configure({
	layoutTemplate: 'layout',
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

Router.route('/championship/:_id/edit', {
	name: 'editChampionship'
});

Router.route('/championship/game/:_id', {
	name: 'gameDetails'
});

Router.route('/account', {
	name: 'account'
});
