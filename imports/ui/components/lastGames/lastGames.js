class LastGamesComponent extends BlazeComponent {
	template() {
		return 'lastGames';
	}

	onRendered() {
		super.onRendered();
	}

	game() {
		return Games.find({ championshipId: Router.current().params._id }, {
			sort: {
				gameDate: -1
			},
			limit: Number(this.data().nbGames)
		});
	}
}

LastGamesComponent.register('LastGamesComponent');
