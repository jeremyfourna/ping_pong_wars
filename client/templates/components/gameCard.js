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
}

GameCard.register('GameCard');
