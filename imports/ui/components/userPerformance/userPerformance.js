import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { lodash } from 'meteor/stevezhu:lodash';
import 'meteor/peernohell:c3';

import { Championships } from '../../../api/championships/schema.js';

import './userPerformance.jade';

Template.userPerformance.onCreated(function() {
	this.autorun(() => {
		this.subscribe('championshipsForUser', Meteor.userId());
	});
});

Template.userPerformance.onRendered(function() {
	let chart = c3.generate({
		bindto: '#userRankingGraph',
		size: { height: 480 },
		data: { type: 'line', columns: [] },
		axis: {
			y: {
				label: { text: 'Points', position: 'outer-middle' }
			},
			x: {
				label: { text: 'Vos matchs', position: 'outer-center' }
			}
		},
		grid: {
			y: { show: true }
		}
	});

	this.autorun(function(tracker) {
		let champs = Championships.find({ 'players.playerId': Meteor.userId() }).fetch();
		let userData = [];
		champs.map((cur, index, array) => {
			let ind = lodash.findIndex(cur.players, ['playerId', Meteor.userId()]);
			if (ind !== -1) {
				let list = [];
				list.push(cur.name);
				list = list.concat(cur.players[ind].points);
				userData.push(list);
			}
		});
		chart.load({
			columns: userData
		});
	});
});
