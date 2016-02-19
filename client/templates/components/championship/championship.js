class Championship extends BlazeComponent {
	onCreated() {
		super.onCreated();
		this.championshipData = new ReactiveField({});
	}

	template() {
		return 'championship';
	}

	events() {
		return super.events().concat({});
	}
}

Championship.register('Championship');
