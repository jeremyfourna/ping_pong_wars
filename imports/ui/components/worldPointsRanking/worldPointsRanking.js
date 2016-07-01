import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './worldPointsRanking.jade';

Template.worldPointsRanking.onCreated(function() {
	this.autorun(() => {
		this.subscribe('allUsersForWorldRanking');
	});
});

Template.worldPointsRanking.helpers({
	myIndex(index) {
		return index + 1;
	},
	players() {
		let list = Meteor.users.find({}, {
			fields: {
				'profile.worldPoints': 1,
				'profile.fullName': 1
			},
			sort: {
				'profile.worldPoints': -1
			},
			limit: 10
		}).fetch();
		let listLength = list.length;
		list.map((cur, index, array) => {
			if (index <= 2) {
				return cur.colorClass = 'success';
			}
		});
		return list;
	}
});
