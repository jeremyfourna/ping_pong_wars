import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { Bert } from 'meteor/themeteorchef:bert';
import { lodash } from 'meteor/stevezhu:lodash';
import { c3 } from 'meteor/peernohell:c3';

import { Games } from '../../../api/games/schema.js';

import './gameDetails.jade';

Template.gameDetails.onCreated(function() {
	this.autorun(() => {
		this.subscribe('aGame', Router.current().params._id);
		this.subscribe('playersForAGame', Router.current().params._id);
		this.subscribe('gamesBetweenTwoPlayersInAChampionship', Router.current().params._id);
	});
});

Template.gameDetails.onRendered(function() {
	let chart = c3.generate({
		bindto: '#historyGraph',
		data: {
			type: 'bar',
			columns: []
		},
		bar: {
			width: {
				ratio: 0.5
			}
		}
	});
	this.autorun(function(tracker) {
		let players = Games.findOne({ _id: Router.current().params._id });
		let twoUserData = Meteor.users.find({
			$or: [{ _id: players.player1 }, { _id: players.player2 }]
		}, {
			fields: {
				'profile.firstName': 1,
				'profile.lastName': 1,
				_id: 1
			}
		}).fetch();
		let gamesBetweenTwoPlayers = Games.find({
			$or: [{
				$and: [
					{ player1: players.player1 },
					{ player2: players.player2 }
				]
			}, {
				$and: [
					{ player2: players.player1 },
					{ player1: players.player2 }
				]
			}],
			championshipId: players.championshipId
		}).fetch();
		let gamesData = [
			[fullName(twoUserData[0].profile), 0],
			[fullName(twoUserData[1].profile), 0]
		];
		let finalList = [];

		lodash.each(gamesBetweenTwoPlayers, function(game) {
			if (game.player1 === twoUserData[0]._id && game.player2 === twoUserData[1]._id) {
				gamesData[0][1] = gamesData[0][1] + 1;
			} else if (game.player1 === twoUserData[1]._id && game.player2 === twoUserData[0]._id) {
				gamesData[1][1] = gamesData[1][1] + 1;
			}
		});

		if (twoUserData[0]._id === players.player1) {
			finalList = [
				gamesData[0],
				gamesData[1]
			];
		} else {
			finalList = [
				gamesData[1],
				gamesData[0]
			];
		}
		chart.load({
			columns: finalList
		});
	});
});

Template.gameDetails.helpers({
	gameData() {
		return Games.findOne({ _id: Router.current().params._id });
	},
	panelClass() {
		if (this.over10()) {
			return 'panel-info';
		} else if (this.currentData().scoreGap() === 2) {
			return 'panel-warning';
		} else if (this.currentData().scoreGap() > 5) {
			return 'panel-success';
		} else {
			return 'panel-default';
		}
	},
	player1FullName() {
		return fullName(Meteor.users.findOne({ _id: this.currentData().player1 }, {
			fields: {
				'profile.lastName': 1,
				'profile.firstName': 1
			}
		}).profile);
	},
	player2FullName() {
		return fullName(Meteor.users.findOne({ _id: this.currentData().player2 }, {
			fields: {
				'profile.lastName': 1,
				'profile.firstName': 1
			}
		}).profile);
	}
});
