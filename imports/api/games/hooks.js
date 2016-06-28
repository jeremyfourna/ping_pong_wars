import { Meteor } from 'meteor/meteor';
import { MethodHooks } from 'meteor/doctorpangloss:method-hooks';

import { worldPointsForAGame } from '../../startup/sharedFunctions.js';

MethodHooks.after('addAChampionshipGame', (options) => {
	if (options.error) {
		return;
	} else if (options.result) {
		let pointsForPlayer1 = 5;
		let pointsForPlayer2 = 1;
		pointsForPlayer1 += worldPointsForAGame(options.arguments[0].scorePlayer1, options.arguments[0].scorePlayer2).win;
		pointsForPlayer2 += worldPointsForAGame(options.arguments[0].scorePlayer1, options.arguments[0].scorePlayer2).loose;
		const player1 = {
			playerId: options.arguments[0].player1,
			pointsToAdd: pointsForPlayer1
		};
		const player2 = {
			playerId: options.arguments[0].player2,
			pointsToAdd: pointsForPlayer2
		};
		Meteor.call('updateWorldPoints', player1);
		Meteor.call('updateWorldPoints', player2);
		return options.result;
	}
	return options.result;
});
