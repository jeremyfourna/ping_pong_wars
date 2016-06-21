import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { lodash } from 'meteor/stevezhu:lodash';
import 'meteor/sacha:spin';

import { fullName, over10 } from '../../../startup/sharedFunctions.js';

import './gameCard.jade';

Template.gameCard.onCreated(function() {
	this.autorun(() => {
		this.subscribe('allUsersForAChampionship', Router.current().params._id);
	});
});

Template.gameCard.helpers({
	panelClass() {
		if (over10(this.scorePlayer1)) {
			return 'panel-info';
		} else if (this.scorePlayer1 - this.scorePlayer2 === 2) {
			return 'panel-warning';
		} else if (this.scorePlayer1 - this.scorePlayer2 > 5) {
			return 'panel-success';
		} else {
			return 'panel-default';
		}
	},
	player1FullName() {
		let data = Meteor.users.findOne({ _id: this.player1 }, {
			fields: {
				'profile.lastName': 1,
				'profile.firstName': 1
			}
		});
		return fullName(data.profile);
	},
	player2FullName() {
		let data = Meteor.users.findOne({ _id: this.player2 }, {
			fields: {
				'profile.lastName': 1,
				'profile.firstName': 1
			}
		});
		return fullName(data.profile);
	}
});
