Meteor.publish('allUsers', function() {
	return Meteor.users.find({}, {
		fields: {
			'profile.firstName': 1,
			'profile.lastName': 1,
			'profile.points': 1,
			'_id': 1
		}
	});
});
