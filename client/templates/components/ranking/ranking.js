class Ranking extends BlazeComponent {
	template() {
		return 'ranking';
	}

	onRendered() {
		var userData = [];
		for (var i = 0; i < this.data().fetch().length; i++) {
			var list = [];
			list.push(this.data().fetch()[i].fullName());
			list = list.concat(this.data().fetch()[i].profile.points);
			userData.push(list);
		}
		var chart = c3.generate({
			bindto: '#rankingGraph',
			data: {
				type: 'line',
				columns: userData
			},
		});
		chart.load({
			columns: userData
		});
	}
}

Ranking.register('Ranking');
