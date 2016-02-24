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
		var cp = Accounts.createUser({
			password: '123456',
			username: 'christy_p',
			profile: {
				firstName: 'Christy',
				lastName: 'Patisson'
			}
		});
		var gamesList = [{
			player1: av,
			player2: ml,
			gameDate: new Date(2015, 11, 10),
			scorePlayer1: 10,
			scorePlayer2: 3,
			addedBy: jf
		}, {
			player1: av,
			player2: jf,
			gameDate: new Date(2015, 11, 10),
			scorePlayer1: 10,
			scorePlayer2: 4,
			addedBy: jf
		}, {
			player1: lt,
			player2: ac,
			gameDate: new Date(2015, 11, 10),
			scorePlayer1: 10,
			scorePlayer2: 2,
			addedBy: jf
		}, {
			player1: lt,
			player2: rk,
			gameDate: new Date(2015, 11, 10),
			scorePlayer1: 10,
			scorePlayer2: 6,
			addedBy: jf
		}, {
			player1: av,
			player2: ac,
			gameDate: new Date(2015, 11, 10),
			scorePlayer1: 10,
			scorePlayer2: 3,
			addedBy: jf
		}, {
			player1: lt,
			player2: ol,
			gameDate: new Date(2015, 11, 10),
			scorePlayer1: 12,
			scorePlayer2: 10,
			addedBy: jf
		}, {
			player1: av,
			player2: mp,
			gameDate: new Date(2015, 11, 10),
			scorePlayer1: 10,
			scorePlayer2: 3,
			addedBy: jf
		}, {
			player1: av,
			player2: jf,
			gameDate: new Date(2015, 11, 10),
			scorePlayer1: 10,
			scorePlayer2: 2,
			addedBy: jf
		}, {
			player1: jf,
			player2: ml,
			gameDate: new Date(2015, 11, 17),
			scorePlayer1: 10,
			scorePlayer2: 8,
			addedBy: jf
		}, {
			player1: jf,
			player2: lt,
			gameDate: new Date(2015, 11, 17),
			scorePlayer1: 5,
			scorePlayer2: 10,
			addedBy: jf
		}, {
			player1: av,
			player2: ac,
			gameDate: new Date(2015, 11, 17),
			scorePlayer1: 10,
			scorePlayer2: 4,
			addedBy: jf
		}, {
			player1: av,
			player2: ml,
			gameDate: new Date(2015, 11, 17),
			scorePlayer1: 11,
			scorePlayer2: 9,
			addedBy: jf
		}, {
			player1: av,
			player2: mz,
			gameDate: new Date(2015, 11, 17),
			scorePlayer1: 10,
			scorePlayer2: 5,
			addedBy: jf
		}, {
			player1: ac,
			player2: lt,
			gameDate: new Date(2015, 11, 17),
			scorePlayer1: 10,
			scorePlayer2: 7,
			addedBy: jf
		}, {
			player1: ac,
			player2: ml,
			gameDate: new Date(2015, 11, 17),
			scorePlayer1: 11,
			scorePlayer2: 9,
			addedBy: jf
		}, {
			player1: av,
			player2: lt,
			gameDate: new Date(2015, 11, 17),
			scorePlayer1: 10,
			scorePlayer2: 6,
			addedBy: jf
		}, {
			player1: av,
			player2: jf,
			gameDate: new Date(2015, 11, 17),
			scorePlayer1: 10,
			scorePlayer2: 8,
			addedBy: jf
		}, {
			player1: av,
			player2: mp,
			gameDate: new Date(2015, 11, 17),
			scorePlayer1: 10,
			scorePlayer2: 3,
			addedBy: jf
		}, {
			player1: av,
			player2: ac,
			gameDate: new Date(2015, 11, 17),
			scorePlayer1: 10,
			scorePlayer2: 4,
			addedBy: jf
		}, {
			player1: jf,
			player2: ct,
			gameDate: new Date(2015, 11, 18),
			scorePlayer1: 10,
			scorePlayer2: 3,
			addedBy: jf
		}, {
			player1: jf,
			player2: sk,
			gameDate: new Date(2015, 11, 18),
			scorePlayer1: 10,
			scorePlayer2: 6,
			addedBy: jf
		}, {
			player1: ml,
			player2: ct,
			gameDate: new Date(2015, 11, 18),
			scorePlayer1: 10,
			scorePlayer2: 7,
			addedBy: jf
		}, {
			player1: ml,
			player2: sk,
			gameDate: new Date(2015, 11, 18),
			scorePlayer1: 10,
			scorePlayer2: 6,
			addedBy: jf
		}, {
			player1: jf,
			player2: ml,
			gameDate: new Date(2015, 11, 18),
			scorePlayer1: 10,
			scorePlayer2: 8,
			addedBy: jf
		}, {
			player1: ml,
			player2: lt,
			gameDate: new Date(2016, 0, 11),
			scorePlayer1: 8,
			scorePlayer2: 10,
			addedBy: jf
		}, {
			player1: lt,
			player2: jf,
			gameDate: new Date(2016, 0, 11),
			scorePlayer1: 10,
			scorePlayer2: 6,
			addedBy: jf
		}, {
			player1: ct,
			player2: lt,
			gameDate: new Date(2016, 0, 11),
			scorePlayer1: 4,
			scorePlayer2: 10,
			addedBy: jf
		}, {
			player1: lt,
			player2: av,
			gameDate: new Date(2016, 0, 11),
			scorePlayer1: 10,
			scorePlayer2: 7,
			addedBy: jf
		}, {
			player1: lt,
			player2: jf,
			gameDate: new Date(2016, 0, 15),
			scorePlayer1: 10,
			scorePlayer2: 7,
			addedBy: jf
		}, {
			player1: lt,
			player2: jf,
			gameDate: new Date(2016, 0, 15),
			scorePlayer1: 10,
			scorePlayer2: 5,
			addedBy: jf
		}, {
			player1: lt,
			player2: jf,
			gameDate: new Date(2016, 0, 15),
			scorePlayer1: 10,
			scorePlayer2: 5,
			addedBy: jf
		}, {
			player1: ac,
			player2: ol,
			gameDate: new Date(2016, 0, 22),
			scorePlayer1: 10,
			scorePlayer2: 1,
			addedBy: jf
		}, {
			player1: ac,
			player2: av,
			gameDate: new Date(2016, 0, 22),
			scorePlayer1: 10,
			scorePlayer2: 7,
			addedBy: jf
		}, {
			player1: lt,
			player2: jf,
			gameDate: new Date(2016, 0, 25),
			scorePlayer1: 10,
			scorePlayer2: 5,
			addedBy: jf
		}, {
			player1: ml,
			player2: lt,
			gameDate: new Date(2016, 0, 25),
			scorePlayer1: 10,
			scorePlayer2: 8,
			addedBy: jf
		}, {
			player1: ml,
			player2: ac,
			gameDate: new Date(2016, 0, 25),
			scorePlayer1: 10,
			scorePlayer2: 8,
			addedBy: jf
		}, {
			player1: jf,
			player2: ct,
			gameDate: new Date(2016, 0, 25),
			scorePlayer1: 10,
			scorePlayer2: 6,
			addedBy: jf
		}, {
			player1: ml,
			player2: ct,
			gameDate: new Date(2016, 0, 25),
			scorePlayer1: 10,
			scorePlayer2: 5,
			addedBy: jf
		}, {
			player1: ml,
			player2: jf,
			gameDate: new Date(2016, 0, 25),
			scorePlayer1: 5,
			scorePlayer2: 10,
			addedBy: jf
		}, {
			player1: av,
			player2: ct,
			gameDate: new Date(2016, 0, 26),
			scorePlayer1: 10,
			scorePlayer2: 6,
			addedBy: jf
		}, {
			player1: lt,
			player2: jf,
			gameDate: new Date(2016, 0, 26),
			scorePlayer1: 10,
			scorePlayer2: 8,
			addedBy: jf
		}, {
			player1: lt,
			player2: av,
			gameDate: new Date(2016, 0, 26),
			scorePlayer1: 10,
			scorePlayer2: 8,
			addedBy: jf
		}, {
			player1: ml,
			player2: ct,
			gameDate: new Date(2016, 0, 26),
			scorePlayer1: 10,
			scorePlayer2: 3,
			addedBy: jf
		}, {
			player1: av,
			player2: ml,
			gameDate: new Date(2016, 0, 26),
			scorePlayer1: 10,
			scorePlayer2: 8,
			addedBy: jf
		}, {
			player1: av,
			player2: jf,
			gameDate: new Date(2016, 0, 26),
			scorePlayer1: 11,
			scorePlayer2: 9,
			addedBy: jf
		}, {
			player1: lt,
			player2: ml,
			gameDate: new Date(2016, 0, 26),
			scorePlayer1: 10,
			scorePlayer2: 7,
			addedBy: jf
		}, {
			player1: lt,
			player2: ol,
			gameDate: new Date(2016, 0, 26),
			scorePlayer1: 9,
			scorePlayer2: 11,
			addedBy: jf
		}, {
			player1: jf,
			player2: ct,
			gameDate: new Date(2016, 0, 29),
			scorePlayer1: 10,
			scorePlayer2: 7,
			addedBy: jf
		}, {
			player1: ml,
			player2: jf,
			gameDate: new Date(2016, 0, 29),
			scorePlayer1: 10,
			scorePlayer2: 7,
			addedBy: jf
		}, {
			player1: av,
			player2: ct,
			gameDate: new Date(2016, 0, 29),
			scorePlayer1: 10,
			scorePlayer2: 5,
			addedBy: jf
		}, {
			player1: av,
			player2: jf,
			gameDate: new Date(2016, 0, 29),
			scorePlayer1: 10,
			scorePlayer2: 8,
			addedBy: jf
		}, {
			player1: av,
			player2: jf,
			gameDate: new Date(2016, 1, 1),
			scorePlayer1: 10,
			scorePlayer2: 2,
			addedBy: jf
		}, {
			player1: av,
			player2: jf,
			gameDate: new Date(2016, 1, 1),
			scorePlayer1: 10,
			scorePlayer2: 5,
			addedBy: jf
		}, {
			player1: av,
			player2: jf,
			gameDate: new Date(2016, 1, 1),
			scorePlayer1: 10,
			scorePlayer2: 5,
			addedBy: jf
		}, {
			player1: lt,
			player2: jf,
			gameDate: new Date(2016, 1, 4),
			scorePlayer1: 10,
			scorePlayer2: 5,
			addedBy: jf
		}, {
			player1: lt,
			player2: jf,
			gameDate: new Date(2016, 1, 4),
			scorePlayer1: 9,
			scorePlayer2: 11,
			addedBy: jf
		}, {
			player1: lt,
			player2: jf,
			gameDate: new Date(2016, 1, 4),
			scorePlayer1: 10,
			scorePlayer2: 6,
			addedBy: jf
		}, {
			player1: ml,
			player2: jf,
			gameDate: new Date(2016, 1, 4),
			scorePlayer1: 12,
			scorePlayer2: 10,
			addedBy: jf
		}, {
			player1: jf,
			player2: ac,
			gameDate: new Date(2016, 1, 8),
			scorePlayer1: 10,
			scorePlayer2: 7,
			addedBy: jf
		}, {
			player1: jf,
			player2: av,
			gameDate: new Date(2016, 1, 8),
			scorePlayer1: 10,
			scorePlayer2: 6,
			addedBy: jf
		}, {
			player1: jf,
			player2: ct,
			gameDate: new Date(2016, 1, 8),
			scorePlayer1: 10,
			scorePlayer2: 3,
			addedBy: jf
		}, {
			player1: av,
			player2: ct,
			gameDate: new Date(2016, 1, 8),
			scorePlayer1: 10,
			scorePlayer2: 5,
			addedBy: jf
		}, {
			player1: av,
			player2: ac,
			gameDate: new Date(2016, 1, 8),
			scorePlayer1: 10,
			scorePlayer2: 7,
			addedBy: jf
		}, {
			player1: ol,
			player2: ac,
			gameDate: new Date(2016, 1, 8),
			scorePlayer1: 10,
			scorePlayer2: 7,
			addedBy: jf
		}, {
			player1: av,
			player2: jf,
			gameDate: new Date(2016, 1, 15),
			scorePlayer1: 10,
			scorePlayer2: 8,
			addedBy: jf
		}, {
			player1: av,
			player2: lt,
			gameDate: new Date(2016, 1, 15),
			scorePlayer1: 10,
			scorePlayer2: 12,
			addedBy: jf
		}, {
			player1: ct,
			player2: lt,
			gameDate: new Date(2016, 1, 15),
			scorePlayer1: 10,
			scorePlayer2: 7,
			addedBy: jf
		}, {
			player1: ct,
			player2: sk,
			gameDate: new Date(2016, 1, 15),
			scorePlayer1: 10,
			scorePlayer2: 0,
			addedBy: jf
		}, {
			player1: jf,
			player2: ct,
			gameDate: new Date(2016, 1, 15),
			scorePlayer1: 10,
			scorePlayer2: 6,
			addedBy: jf
		}, {
			player1: jf,
			player2: av,
			gameDate: new Date(2016, 1, 15),
			scorePlayer1: 10,
			scorePlayer2: 6,
			addedBy: jf
		}, {
			player1: jf,
			player2: av,
			gameDate: new Date(2016, 1, 15),
			scorePlayer1: 14,
			scorePlayer2: 12,
			addedBy: jf
		}, {
			player1: av,
			player2: lt,
			gameDate: new Date(2016, 1, 15),
			scorePlayer1: 10,
			scorePlayer2: 6,
			addedBy: jf
		}, {
			player1: jf,
			player2: lt,
			gameDate: new Date(2016, 1, 16),
			scorePlayer1: 10,
			scorePlayer2: 3,
			addedBy: jf
		}, {
			player1: jf,
			player2: ct,
			gameDate: new Date(2016, 1, 16),
			scorePlayer1: 10,
			scorePlayer2: 4,
			addedBy: jf
		}, {
			player1: jf,
			player2: sk,
			gameDate: new Date(2016, 1, 16),
			scorePlayer1: 10,
			scorePlayer2: 5,
			addedBy: jf
		}, {
			player1: jf,
			player2: av,
			gameDate: new Date(2016, 1, 16),
			scorePlayer1: 8,
			scorePlayer2: 10,
			addedBy: jf
		}, {
			player1: av,
			player2: lt,
			gameDate: new Date(2016, 1, 16),
			scorePlayer1: 9,
			scorePlayer2: 11,
			addedBy: jf
		}, {
			player1: jf,
			player2: lt,
			gameDate: new Date(2016, 1, 16),
			scorePlayer1: 10,
			scorePlayer2: 4,
			addedBy: jf
		}, {
			player1: jf,
			player2: lt,
			gameDate: new Date(2016, 1, 18),
			scorePlayer1: 10,
			scorePlayer2: 1,
			addedBy: jf
		}, {
			player1: jf,
			player2: ct,
			gameDate: new Date(2016, 1, 18),
			scorePlayer1: 10,
			scorePlayer2: 2,
			addedBy: jf
		}, {
			player1: jf,
			player2: sk,
			gameDate: new Date(2016, 1, 18),
			scorePlayer1: 10,
			scorePlayer2: 5,
			addedBy: jf
		}, {
			player1: jf,
			player2: av,
			gameDate: new Date(2016, 1, 18),
			scorePlayer1: 10,
			scorePlayer2: 6,
			addedBy: jf
		}, {
			player1: jf,
			player2: ml,
			gameDate: new Date(2016, 1, 18),
			scorePlayer1: 10,
			scorePlayer2: 7,
			addedBy: jf
		}, {
			player1: jf,
			player2: lt,
			gameDate: new Date(2016, 1, 18),
			scorePlayer1: 10,
			scorePlayer2: 6,
			addedBy: jf
		}, {
			player1: jf,
			player2: av,
			gameDate: new Date(2016, 1, 18),
			scorePlayer1: 8,
			scorePlayer2: 10,
			addedBy: jf
		}, {
			player1: jf,
			player2: lt,
			gameDate: new Date(2016, 1, 18),
			scorePlayer1: 10,
			scorePlayer2: 5,
			addedBy: jf
		}, {
			player1: ml,
			player2: lt,
			gameDate: new Date(2016, 1, 18),
			scorePlayer1: 10,
			scorePlayer2: 6,
			addedBy: jf
		}, {
			player1: jf,
			player2: ml,
			gameDate: new Date(2016, 1, 18),
			scorePlayer1: 10,
			scorePlayer2: 6,
			addedBy: jf
		}, {
			player1: ml,
			player2: av,
			gameDate: new Date(2016, 1, 18),
			scorePlayer1: 16,
			scorePlayer2: 14,
			addedBy: jf
		}, {
			player1: ct,
			player2: jf,
			gameDate: new Date(2016, 1, 18),
			scorePlayer1: 12,
			scorePlayer2: 10,
			addedBy: jf
		}, {
			player1: av,
			player2: lt,
			gameDate: new Date(2016, 1, 19),
			scorePlayer1: 10,
			scorePlayer2: 5,
			addedBy: jf
		}, {
			player1: jf,
			player2: av,
			gameDate: new Date(2016, 1, 19),
			scorePlayer1: 4,
			scorePlayer2: 10,
			addedBy: jf
		}, {
			player1: av,
			player2: ac,
			gameDate: new Date(2016, 1, 19),
			scorePlayer1: 10,
			scorePlayer2: 5,
			addedBy: jf
		}, {
			player1: av,
			player2: ct,
			gameDate: new Date(2016, 1, 19),
			scorePlayer1: 10,
			scorePlayer2: 2,
			addedBy: jf
		}, {
			player1: ml,
			player2: av,
			gameDate: new Date(2016, 1, 19),
			scorePlayer1: 10,
			scorePlayer2: 2,
			addedBy: jf
		}, {
			player1: av,
			player2: mz,
			gameDate: new Date(2016, 1, 24, 15, 50, 53),
			scorePlayer1: 10,
			scorePlayer2: 2,
			addedBy: jf
		}, {
			player1: av,
			player2: lt,
			gameDate: new Date(2016, 1, 24, 15, 46, 56),
			scorePlayer1: 10,
			scorePlayer2: 2,
			addedBy: jf
		}, {
			player1: av,
			player2: jf,
			gameDate: new Date(2016, 1, 24, 15, 44, 59),
			scorePlayer1: 3,
			scorePlayer2: 10,
			addedBy: jf
		}, {
			player1: lt,
			player2: ml,
			gameDate: new Date(2016, 1, 24, 15, 43, 41),
			scorePlayer1: 10,
			scorePlayer2: 5,
			addedBy: jf
		}, {
			player1: av,
			player2: ct,
			gameDate: new Date(2016, 1, 24, 15, 34, 07),
			scorePlayer1: 10,
			scorePlayer2: 2,
			addedBy: jf
		}, {
			player1: ct,
			player2: ml,
			gameDate: new Date(2016, 1, 24, 15, 32, 23),
			scorePlayer1: 10,
			scorePlayer2: 7,
			addedBy: jf
		}, {
			player1: lt,
			player2: mz,
			gameDate: new Date(2016, 1, 24, 15, 32, 23),
			scorePlayer1: 10,
			scorePlayer2: 3,
			addedBy: jf
		}, {
			player1: ct,
			player2: lt,
			gameDate: new Date(2016, 1, 24, 15, 31, 29),
			scorePlayer1: 15,
			scorePlayer2: 13,
			addedBy: jf
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
