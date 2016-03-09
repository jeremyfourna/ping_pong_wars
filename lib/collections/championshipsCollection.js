Championships = new Mongo.Collection('championships');

var Schemas = {};

playerPoints = new SimpleSchema({
	playerId: {
		type: String,
		label: 'Player ID'
	},
	points: {
		type: [Number],
		labe: 'Player points list'
	}
});

Schemas.Championships = new SimpleSchema({
	name: {
		type: String,
		label: 'Name of the Championship'
	},
	players: {
		type: [playerPoints],
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
	}
});

Championships.attachSchema(Schemas.Championships);

Championships.helpers({});

Meteor.methods({
	addPlayerInChampionship(userId, championshipId) {
		check(userId, String);
		check(championshipId, String);
		var playerData = {
			playerId: userId,
			points: [1500]
		};
		return Championships.update({ _id: championshipId }, {
			$push: {
				players: playerData
			}
		});
	},
	addPointsForPlayerInChampionship(championshipId, playerId, newPoints) {
		check(championshipId, String);
		check(playerId, String);
		check(newPoints, Number);
		return Championships.update({ _id: championshipId });
	}
});
