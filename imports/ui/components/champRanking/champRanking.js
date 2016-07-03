import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { lodash } from 'meteor/stevezhu:lodash';
import 'meteor/sacha:spin';

import { Championships } from '../../../api/championships/schema.js';
import { last10GamesPerf } from '../../../startup/sharedFunctions.js';

import './champRanking.jade';

Template.champRanking.onCreated(function() {
	this.autorun(() => {
		this.subscribe('aChampionship', Router.current().params._id);
		this.subscribe('allUsersForAChampionship', Router.current().params._id);
	});
});

Template.champRanking.helpers({
	champInfos() {
		return Championships.findOne({ _id: Router.current().params._id }, {
			fields: {
				numberOfGamesToBeDisplayedInTheRanking: 1
			}
		});
	},
	playersRanking() {
		let newList = [];
		let freshData = Meteor.users.find({ 'profile.championships': Router.current().params._id }, {
			fields: {
				'profile.fullName': 1
			}
		}).fetch();
		let champData = Championships.findOne({ _id: Router.current().params._id }, {
			fields: {
				players: 1,
				numberOfGamesToBeDisplayedInTheRanking: 1
			}
		});
		freshData.map((cur, index, array) => {
			let ind = lodash.findIndex(champData.players, ['playerId', cur._id]);
			if (champData.players[ind].points.length >= champData.numberOfGamesToBeDisplayedInTheRanking) {
				cur.last10GamesPerf = last10GamesPerf(champData.players[ind].points);
				cur.points = champData.players[ind].points;
				cur.nbGames = cur.points.length;
				cur.currentPoints = champData.players[ind].points.pop();
				newList.push(cur);
			}
		});
		newList.sort((a, b) => {
			if (a.currentPoints > b.currentPoints) {
				return -1;
			}
			if (a.currentPoints < b.currentPoints) {
				return 1;
			}
			return 0;
		});
		let newListLength = newList.length;
		newList.map((cur, index, array) => {
			if (index <= 2) {
				return cur.colorClass = 'success';
			} else if (index >= newListLength - 3) {
				return cur.colorClass = 'danger';
			}
		});
		return newList;
	},
	myIndex(index) {
		return index + 1;
	}
});
