import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

Meteor.methods({
	updateUserData(data) {
		let methodSchema = new SimpleSchema({
			firstName: { type: String },
			lastName: { type: String },
			userId: { type: String }
		});
		check(data, methodSchema);
		Meteor.users.update({ _id: data.userId }, {
			$set: {
				'profile.firstName': data.firstName,
				'profile.lastName': data.lastName
			}
		});
	},
	addChampionshipIntoProfile(data) {
		let methodSchema = new SimpleSchema({
			userId: { type: String },
			championshipId: { type: String }
		});
		check(data, methodSchema);
		Meteor.users.update({ _id: data.userId }, {
			$push: {
				'profile.championships': data.championshipId
			}
		});
	}
});
