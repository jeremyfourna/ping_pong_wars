import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Games = new Mongo.Collection('games');

Games.deny({
	insert() {
		return true;
	},
	update() {
		return true;
	},
	remove() {
		return true;
	}
});

Games.schema = new SimpleSchema({
	player1: {
		type: String,
		label: 'User ID of player1'
	},
	player2: {
		type: String,
		label: 'User ID of player2'
	},
	gameDate: {
		type: Date,
		label: 'Date of the game'
	},
	scorePlayer1: {
		type: Number,
		label: 'Player1 score',
		min: 0
	},
	scorePlayer2: {
		type: Number,
		label: 'player2 score',
		min: 0
	},
	lastPointsPlayer1: {
		type: Number,
		label: 'Player 1 points before the game',
		optional: true
	},
	lastPointsPlayer2: {
		type: Number,
		label: 'Player 2 points before the game',
		optional: true
	},
	newPointsPlayer1: {
		type: Number,
		label: 'Player 1 points after the game',
		optional: true
	},
	newPointsPlayer2: {
		type: Number,
		label: 'Player 2 points after the game',
		optional: true
	},
	kBasePlayer1: {
		type: Number,
		label: 'K for player 1'
	},
	kBasePlayer2: {
		type: Number,
		label: 'K for player 2'
	},
	addedBy: {
		type: String,
		label: 'User Id who added the game'
	},
	championshipId: {
		type: String,
		label: 'Championship ID',
		optional: true
	},
	tournamentId: {
		type: String,
		label: 'Tournament ID',
		optional: true
	}
});

Games.helpers({
	player1Data() {
		return Meteor.users.findOne(this.player1);
	},
	player2Data() {
		return Meteor.users.findOne(this.player2);
	},
	lastPointsGap() {
		return Math.abs(this.lastPointsPlayer1 - this.lastPointsPlayer2);
	},
	newPointsGap() {
		return Math.abs(this.newPointsPlayer1 - this.newPointsPlayer2);
	},
	kBaseGap() {
		return Math.abs(this.kBasePlayer1 - this.kBasePlayer2);
	},
	championshipName() {
		return Championships.findOne(this.championshipId).name;
	},
	tournamentName() {
		return Tournaments.findOne(this.tournamentId).name;
	},
	player1Gain() {
		return this.newPointsPlayer1 - this.lastPointsPlayer1;
	},
	player2Gain() {
		return this.newPointsPlayer2 - this.lastPointsPlayer2;
	},
	gameDateFromNow() {
		return moment(this.gameDate).fromNow();
	},
	gainGap() {
		return this.newPointsGap() - this.lastPointsGap();
	}
});
