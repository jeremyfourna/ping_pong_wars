Meteor.startup(function() {
	if (Games.find({}).count() === 0) {
		var jf = Accounts.createUser({
			password: '123456',
			username: 'jeremy_f',
			profile: {
				firstName: 'Jeremy',
				lastName: 'Fourna'
			}
		});
		var av = Accounts.createUser({
			password: '123456',
			username: 'antoine_v',
			profile: {
				firstName: 'Antoine',
				lastName: 'Vanderstukken'
			}
		});
		var ml = Accounts.createUser({
			password: '123456',
			username: 'mickael_l',
			profile: {
				firstName: 'Mickaël',
				lastName: 'Lattes'
			}
		});
		var lt = Accounts.createUser({
			password: '123456',
			username: 'laurent_t',
			profile: {
				firstName: 'Laurent',
				lastName: 'Toussaint'
			}
		});
		var ac = Accounts.createUser({
			password: '123456',
			username: 'andrea_c',
			profile: {
				firstName: 'Andréa',
				lastName: 'Colonna'
			}
		});
		var rk = Accounts.createUser({
			password: '123456',
			username: 'romain_k',
			profile: {
				firstName: 'Romain',
				lastName: 'Kalinsky'
			}
		});
		var mp = Accounts.createUser({
			password: '123456',
			username: 'mickael_p',
			profile: {
				firstName: 'Mickaël',
				lastName: 'Pouhaer'
			}
		});
		var sk = Accounts.createUser({
			password: '123456',
			username: 'samy_k',
			profile: {
				firstName: 'Samy',
				lastName: 'Khanafer'
			}
		});
		var ct = Accounts.createUser({
			password: '123456',
			username: 'claude_t',
			profile: {
				firstName: 'Claude',
				lastName: 'Traglia'
			}
		});
		var ol = Accounts.createUser({
			password: '123456',
			username: 'olivier_l',
			profile: {
				firstName: 'Olivier',
				lastName: 'Labayle'
			}
		});
		var mz = Accounts.createUser({
			password: '123456',
			username: 'mess_z',
			profile: {
				firstName: 'Mess',
				lastName: 'Zaoui'
			}
		});
		var test = Accounts.createUser({
			password: '123456',
			username: 'test_t'
		});
		var gamesList = [{
			player1: av,
			player2: ml,
			gameDate: new Date(2015, 12, 10),
			scorePlayer1: 10,
			scorePlayer2: 3
		}, {
			player1: av,
			player2: jf,
			gameDate: new Date(2015, 12, 10),
			scorePlayer1: 10,
			scorePlayer2: 4
		}, {
			player1: lt,
			player2: ac,
			gameDate: new Date(2015, 12, 10),
			scorePlayer1: 10,
			scorePlayer2: 2
		}, {
			player1: lt,
			player2: rk,
			gameDate: new Date(2015, 12, 10),
			scorePlayer1: 10,
			scorePlayer2: 6
		}, {
			player1: av,
			player2: ac,
			gameDate: new Date(2015, 12, 10),
			scorePlayer1: 10,
			scorePlayer2: 3
		}, {
			player1: lt,
			player2: ol,
			gameDate: new Date(2015, 12, 10),
			scorePlayer1: 12,
			scorePlayer2: 10
		}, {
			player1: av,
			player2: mp,
			gameDate: new Date(2015, 12, 10),
			scorePlayer1: 10,
			scorePlayer2: 3
		}, {
			player1: av,
			player2: jf,
			gameDate: new Date(2015, 12, 10),
			scorePlayer1: 10,
			scorePlayer2: 2
		}, {
			player1: jf,
			player2: ml,
			gameDate: new Date(2015, 12, 17),
			scorePlayer1: 10,
			scorePlayer2: 8
		}, {
			player1: jf,
			player2: lt,
			gameDate: new Date(2015, 12, 17),
			scorePlayer1: 5,
			scorePlayer2: 10
		}, {
			player1: av,
			player2: ac,
			gameDate: new Date(2015, 12, 17),
			scorePlayer1: 10,
			scorePlayer2: 4
		}, {
			player1: av,
			player2: ml,
			gameDate: new Date(2015, 12, 17),
			scorePlayer1: 11,
			scorePlayer2: 9
		}, {
			player1: av,
			player2: mz,
			gameDate: new Date(2015, 12, 17),
			scorePlayer1: 10,
			scorePlayer2: 5
		}, {
			player1: ac,
			player2: lt,
			gameDate: new Date(2015, 12, 17),
			scorePlayer1: 10,
			scorePlayer2: 7
		}, {
			player1: ac,
			player2: ml,
			gameDate: new Date(2015, 12, 17),
			scorePlayer1: 11,
			scorePlayer2: 9
		}, {
			player1: av,
			player2: lt,
			gameDate: new Date(2015, 12, 17),
			scorePlayer1: 10,
			scorePlayer2: 6
		}, {
			player1: av,
			player2: jf,
			gameDate: new Date(2015, 12, 17),
			scorePlayer1: 10,
			scorePlayer2: 8
		}, {
			player1: av,
			player2: mp,
			gameDate: new Date(2015, 12, 17),
			scorePlayer1: 10,
			scorePlayer2: 3
		}, {
			player1: av,
			player2: ac,
			gameDate: new Date(2015, 12, 17),
			scorePlayer1: 10,
			scorePlayer2: 4
		}];
		for (var i = 0; i < gamesList.length; i++) {
			Meteor.call('addAGame', gamesList[i], function(error, result) {
				if (error) {
					console.log(error.message, error);
				}
			});
		}
	}
});
