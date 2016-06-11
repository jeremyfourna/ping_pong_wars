class GameCard extends BlazeComponent {
	template() {
		return 'gameCard';
	}

	panelClass() {
		if (this.currentData().over10()) {
			return 'panel-info';
		} else if (this.currentData().scoreGap() === 2) {
			return 'panel-warning';
		} else if (this.currentData().scoreGap() > 5) {
			return 'panel-success';
		} else {
			return 'panel-default';
		}
	}

	player1FullName() {
		return fullName(Meteor.users.findOne({ _id: this.currentData().player1 }, {
			fields: {
				'profile.lastName': 1,
				'profile.firstName': 1
			}
		}).profile);
	}

	player2FullName() {
		return fullName(Meteor.users.findOne({ _id: this.currentData().player2 }, {
			fields: {
				'profile.lastName': 1,
				'profile.firstName': 1
			}
		}).profile);
	}
}

GameCard.register('GameCard');
