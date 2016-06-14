import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { lodash } from 'meteor/stevezhu:lodash';

import './gameCard.jade';

Template.gameCard.helpers({
	panelClass() {
		if (this.over10()) {
			return 'panel-info';
		} else if (this.scoreGap() === 2) {
			return 'panel-warning';
		} else if (this.scoreGap() > 5) {
			return 'panel-success';
		} else {
			return 'panel-default';
		}
	},
	player1FullName() {
		return fullName(Meteor.users.findOne({ _id: this.player1 }, {
			fields: {
				'profile.lastName': 1,
				'profile.firstName': 1
			}
		}).profile);
	},
	player2FullName() {
		return fullName(Meteor.users.findOne({ _id: this.player2 }, {
			fields: {
				'profile.lastName': 1,
				'profile.firstName': 1
			}
		}).profile);
	}
});
