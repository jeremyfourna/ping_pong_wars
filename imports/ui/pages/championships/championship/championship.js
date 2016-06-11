class ChampionshipComponent extends BlazeComponent {
	onCreated() {
		super.onCreated();
	}

	template() {
		return 'championship';
	}

	events() {
		return super.events().concat({
			'click #integrateChampionship': this.addPlayerToChampionship
		});
	}

	championshipName() {
		return Championships.findOne({ _id: Router.current().params._id }, {
			fields: {
				name: 1,
				_id: 1
			}
		}).name;
	}

	playerInChampionship() {
		if (lodash.includes(Meteor.user().profile.championships, Router.current().params._id)) {
			return true;
		} else {
			return false;
		}
	}

	addPlayerToChampionship(e) {
		e.preventDefault();
		Meteor.call('addPlayerInChampionship', Meteor.userId(), Router.current().params._id, function(error, result) {
			if (error) {
				return throwError(error.message);
			}
		});
	}
}

ChampionshipComponent.register('ChampionshipComponent');
