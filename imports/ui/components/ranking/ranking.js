import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { lodash } from 'meteor/stevezhu:lodash';
import 'meteor/peernohell:c3';
import 'meteor/sacha:spin';

import { Championships } from '../../../api/championships/schema.js';
import { fullName, last10GamesPerf, lastXGames } from '../../../startup/sharedFunctions.js';

import './ranking.jade';

Template.ranking.onCreated(function() {
	this.autorun(() => {
		this.subscribe('aChampionship', Router.current().params._id);
	});
});

Template.ranking.onRendered(function() {
	let chart = c3.generate({
		bindto: '#rankingGraph',
		size: {
			height: 480
		},
		data: {
			type: 'line',
			columns: []
		},
		axis: {
			y: {
				label: {
					text: 'Points',
					position: 'outer-middle'
				}
			},
			x: {
				label: {
					text: 'Derniers matchs',
					position: 'outer-center'
				}
			}
		},
		grid: {
			y: {
				show: true
			}
		}
	});

	this.autorun(function(tracker) {
		let freshData = Meteor.users.find({ 'profile.championships': Router.current().params._id }, {
			fields: {
				'profile.firstName': 1,
				'profile.lastName': 1,
				_id: 1
			}
		}).fetch();
		let champData = Championships.findOne({ _id: Router.current().params._id }, {
			fields: {
				players: 1,
				numberOfResultsToBeDisplayedInTheGraph: 1
			}
		});
		let userData = [];
		freshData.map((cur, index, array) => {
			let list = [];
			let ind = lodash.findIndex(champData.players, ['playerId', cur._id]);
			list.push(fullName(cur.profile));
			list = list.concat(lastXGames(champData.players[ind].points, champData.numberOfResultsToBeDisplayedInTheGraph));
			userData.push(list);
		});
		userData.sort((a, b) => {
			if (a[0] > b[0]) {
				return 1;
			}
			if (a[0] < b[0]) {
				return -1;
			}
			return 0;
		});
		chart.load({
			columns: userData
		});
	});
});

Template.ranking.helpers({
	champInfos() {
		return Championships.findOne({ _id: Router.current().params._id }, {
			fields: {
				numberOfGamesToBeDisplayedInTheRanking: 1,
				numberOfResultsToBeDisplayedInTheGraph: 1
			}
		});
	},
	playersRanking() {
		let newList = [];
		let freshData = Meteor.users.find({ 'profile.championships': Router.current().params._id }, {
			fields: {
				'profile.firstName': 1,
				'profile.lastName': 1
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
			if (champData.players[ind].points.length > champData.numberOfGamesToBeDisplayedInTheRanking) {
				cur.points = champData.players[ind].points;
				cur.fullName = fullName(cur.profile);
				cur.currentPoints = cur.points.pop();
				cur.nbGames = cur.points.length;
				cur.last10GamesPerf = last10GamesPerf(cur.points);
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
