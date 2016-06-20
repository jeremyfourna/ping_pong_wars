import { Template } from 'meteor/templating';
import 'meteor/sacha:spin';

import { Championships } from '../../../api/championships/schema.js';

import './listChampionships.jade';

Template.listChampionships.onCreated(function() {
	this.autorun(() => {
		this.subscribe('allChampionships');
	});
});

Template.listChampionships.helpers({
	championship() {
		return Championships.find({}, {
			fields: {
				name: 1,
				public: 1,
				players: 1
			}
		});
	},
	nbPlayers() {
		return this.players.length;
	}
});
