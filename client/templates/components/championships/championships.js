class ChampionshipsComponent extends BlazeComponent {
	onCreated() {
		super.onCreated();
	}

	template() {
		return 'championships';
	}

	events() {
		return super.events().concat({});
	}

	championship() {
		return Championships.find({}, {
			fields: {
				name: 1,
				public: 1,
				_id: 1
			}
		});
	}
}

ChampionshipsComponent.register('ChampionshipsComponent');
