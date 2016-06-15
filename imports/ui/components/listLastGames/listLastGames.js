import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { Bert } from 'meteor/themeteorchef:bert';
import { lodash } from 'meteor/stevezhu:lodash';

import { Games } from '../../../api/games/schema.js';

import './listLastGames.jade';
import '../gameCard/gameCard.js';

Template.listLastGames.onCreated(function() {
	this.autorun(() => {
		this.subscribe('lastGamesForAChampionship', Router.current().params._id);
	});
});


Template.listLastGames.helpers({
	game() {
		console.log(Games.find({ championshipId: Router.current().params._id }, {
			sort: {
				gameDate: -1
			},
			limit: Number(this.nbGames)
		}).fetch());
		return Games.find({ championshipId: Router.current().params._id }, {
			sort: {
				gameDate: -1
			},
			limit: Number(this.nbGames)
		});
	}
});
