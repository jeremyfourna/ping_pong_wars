import { Meteor } from 'meteor/meteor';
import { MethodHooks } from 'meteor/doctorpangloss:method-hooks';

MethodHooks.after('createChampionship', (options) => {
	if (options.error) {
		return;
	} else if (options.result) {
		if (options.arguments[0].playersToAdd.length > 0) {
			options.arguments[0].playersToAdd.map((cur, index, array) => {
				let data = {
					userId: cur,
					championshipId: options.result
				};
				return Meteor.call('addChampionshipIntoProfile', data);
			});
		} else {
			let data = {
				userId: options.arguments[0].userId,
				championshipId: options.result
			};
			Meteor.call('addChampionshipIntoProfile', data);
		}
		return options.result;
	}
	return options.result;
});

MethodHooks.after('addPlayerInChampionship', (options) => {
	if (options.error) {
		return;
	} else if (options.result) {
		const data = {
			userId: options.arguments[0].userId,
			championshipId: options.arguments[0].championshipId
		};
		Meteor.call('addChampionshipIntoProfile', data);
		return options.result;
	}
	return options.result;
});
