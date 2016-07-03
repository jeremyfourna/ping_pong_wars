import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { lodash } from 'meteor/stevezhu:lodash';
import 'meteor/peernohell:c3';

import { Championships } from '../../../api/championships/schema.js';
import { lastXGames } from '../../../startup/sharedFunctions.js';

import './champGraph.jade';

Template.champGraph.onCreated(function() {
	this.autorun(() => {
		this.subscribe('aChampionship', Router.current().params._id);
		this.subscribe('allUsersForAChampionship', Router.current().params._id);
	});
});

Template.champGraph.onRendered(function() {
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
				'profile.fullName': 1
			}
		}).fetch();
		let champData = Championships.findOne({ _id: Router.current().params._id }, {
			fields: {
				players: 1,
				numberOfResultsToBeDisplayedInTheGraph: 1
			}
		});
		let userData = [];
		if (freshData && champData) {
			freshData.map((cur, index, array) => {
				let list = [];
				let ind = lodash.findIndex(champData.players, ['playerId', cur._id]);
				list.push(cur.profile.fullName);
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
		}
	});
});

Template.champGraph.helpers({
	champInfos() {
		return Championships.findOne({ _id: Router.current().params._id }, {
			fields: {
				numberOfResultsToBeDisplayedInTheGraph: 1
			}
		});
	}
});
