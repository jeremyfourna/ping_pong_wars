import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { lodash } from 'meteor/stevezhu:lodash';
import 'meteor/peernohell:c3';

import { Championships } from '../../../api/championships/schema.js';
import { fullName } from '../../../startup/sharedFunctions.js';

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
					text: 'Derniers 5 matchs',
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
	$('#championshipRankingTable tbody tr:nth-child(-n+3)').addClass('success');
	$('#championshipRankingTable tbody tr:nth-last-child(-n+3)').addClass('danger');

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
				players: 1
			}
		});
		let userData = [];
		freshData.map((cur, index, array) => {
			let list = [];
			let ind = lodash.findIndex(champData.players, ['playerId', cur._id]);
			list.push(fullName(cur.profile));
			list = list.concat(last5Games(champData.players[ind].points));
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
				players: 1
			}
		});
		freshData.map((cur, index, array) => {
			let ind = lodash.findIndex(champData.players, ['playerId', cur._id]);
			if (champData.players[ind].points.length > 10) {
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
		return newList;
	},
	index(index) {
		return index + 1;
	}
});
