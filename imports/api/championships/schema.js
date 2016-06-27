import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Championships = new Mongo.Collection('championships');

Championships.deny({
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

let PlayerPoints = new SimpleSchema({
	playerId: {
		type: String,
		label: 'Player ID'
	},
	points: {
		type: [Number],
		label: 'Player points list'
	}
});

Championships.schema = new SimpleSchema({
	name: {
		type: String,
		label: 'Name of the Championship'
	},
	players: {
		type: [PlayerPoints],
		label: 'List of the players'
	},
	createdAt: {
		type: Date,
		label: 'Creation date of the Championship'
	},
	createdBy: {
		type: String,
		label: 'User Id who created the Championship'
	},
	public: {
		type: Boolean,
		label: 'Is the Championship public or private ?'
	},
	minPointsToWin: {
		type: Number,
		label: 'Minimum points to attain to win a game',
		min: 1
	},
	numberOfSetsToPlay: {
		type: Number,
		label: 'Number of sets in a game at max, must be odd',
		min: 1
	},
	numberOfGamesToBeDisplayedInTheRanking: {
		type: Number,
		label: 'Minimum games to play to be displayed in the ranking table',
		min: 1
	},
	numberOfResultsToBeDisplayedInTheGraph: {
		type: Number,
		label: 'Last x results to be displayed in the graph',
		min: 3
	}
});
