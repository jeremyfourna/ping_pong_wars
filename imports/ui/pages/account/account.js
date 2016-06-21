import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Bert } from 'meteor/themeteorchef:bert';
import { lodash } from 'meteor/stevezhu:lodash';
import 'meteor/peernohell:c3';
import 'meteor/sacha:spin';

import { Championships } from '../../../api/championships/schema.js';

import './account.jade';

Template.account.onCreated(function() {
	this.autorun(() => {
		this.subscribe('aUser', Meteor.userId());
		this.subscribe('championshipsForUser', Meteor.userId());
	});
});

Template.account.onRendered(function() {
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

Template.account.helpers({
	userData() {
		return Meteor.user();
	}
});

Template.account.events({
	'click #saveUser': function(event) {
		event.preventDefault();
		const user = {
			userId: Meteor.userId(),
			firstName: $('#firstName').val(),
			lastName: $('#lastName').val()
		};
		if (!user.firstName) {
			return Bert.alert('First name must be defined !', 'danger', 'growl-top-right');
		} else if (!user.lastName) {
			return Bert.alert('Last name must be defined !', 'danger', 'growl-top-right');
		} else {
			Meteor.call('updateUserData', user, (error, result) => {
				if (error) {
					return Bert.alert(error.message, 'danger', 'growl-top-right');
				} else {
					return Bert.alert('Update successful', 'success', 'growl-top-right');
				}
			});
		}
	}
});
