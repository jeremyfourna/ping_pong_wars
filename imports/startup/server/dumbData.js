/*eslint no-console: "off"*/

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import { Games } from '../../api/games/schema.js';

Meteor.startup(function() {
	if (Games.find({}).count() === 0) {
		let jf = Accounts.createUser({
			password: '123456',
			username: 'jeremy_f',
			email: 'jeremy.fourna@twenga.com',
			profile: {
				firstName: 'Jeremy',
				lastName: 'Fourna'
			}
		});
		let av = Accounts.createUser({
			password: '123456',
			username: 'antoine_v',
			email: 'antoine.vanderstukken@twenga.com',
			profile: {
				firstName: 'Antoine',
				lastName: 'Vanderstukken'
			}
		});
		let ml = Accounts.createUser({
			password: '123456',
			username: 'mickael_l',
			email: 'mickael.lattes@twenga.com',
			profile: {
				firstName: 'Mickaël',
				lastName: 'Lattes'
			}
		});
		let lt = Accounts.createUser({
			password: '123456',
			username: 'laurent_t',
			email: 'laurent.toussaint@twenga.com',
			profile: {
				firstName: 'Laurent',
				lastName: 'Toussaint'
			}
		});
		let ac = Accounts.createUser({
			password: '123456',
			username: 'andrea_c',
			email: 'andrea.colonna@twenga.com',
			profile: {
				firstName: 'Andréa',
				lastName: 'Colonna'
			}
		});
		let rk = Accounts.createUser({
			password: '123456',
			username: 'romain_k',
			email: 'romain.kalinsky@twenga.com',
			profile: {
				firstName: 'Romain',
				lastName: 'Kalinsky'
			}
		});
		let mp = Accounts.createUser({
			password: '123456',
			username: 'mickael_p',
			email: 'mickael.pouhaer@twenga.com',
			profile: {
				firstName: 'Mickaël',
				lastName: 'Pouhaer'
			}
		});
		let sk = Accounts.createUser({
			password: '123456',
			username: 'samy_k',
			email: 'samy.khanafer@twenga.com',
			profile: {
				firstName: 'Samy',
				lastName: 'Khanafer'
			}
		});
		let ct = Accounts.createUser({
			password: '123456',
			username: 'claude_t',
			email: 'claude.traglia@twenga.com',
			profile: {
				firstName: 'Claude',
				lastName: 'Traglia'
			}
		});
		let ol = Accounts.createUser({
			password: '123456',
			username: 'olivier_l',
			email: 'olivier.labayle@twenga.com',
			profile: {
				firstName: 'Olivier',
				lastName: 'Labayle'
			}
		});
		let mz = Accounts.createUser({
			password: '123456',
			username: 'mess_z',
			email: 'mess.zaoui@twenga.com',
			profile: {
				firstName: 'Mess',
				lastName: 'Zaoui'
			}
		});
		let cp = Accounts.createUser({
			password: '123456',
			username: 'christy_p',
			email: 'christy.patisson@twenga.com',
			profile: {
				firstName: 'Christy',
				lastName: 'Patisson'
			}
		});
		const champ = {
			userId: jf,
			name: 'Twenga - Public',
			public: true,
			minPointsToWin: 10,
			numberOfSetsToPlay: 1,
			numberOfGamesToBeDisplayedInTheRanking: 10,
			numberOfResultsToBeDisplayedInTheGraph: 5,
			playersToAdd: []
		};
		console.log('begin championship creation');
		let twengaChampionship = Meteor.call('createChampionship', champ);
		console.log('Done championship creation', twengaChampionship);
		let playerList = [av, ml, lt, ac, rk, mp, sk, ct, ol, mz, cp];
		console.log('begin adding player into championship');
		playerList.map((cur, index, array) => {
			let data = {
				championshipId: twengaChampionship,
				userId: cur
			};
			Meteor.call('addPlayerInChampionship', data, (error, result) => {
				if (error) {
					console.log(error.message, error);
				} else {
					console.log('addPlayerInChampionship : ' + cur + ' : Done');
				}
			});
		});
		let gamesList = [{
			player1: av,
			player2: ml,
			gameDate: new Date(2015, 11, 10, 15, 50, 53),
			scorePlayer1: 10,
			scorePlayer2: 3,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: av,
			player2: jf,
			gameDate: new Date(2015, 11, 10, 15, 50, 54),
			scorePlayer1: 10,
			scorePlayer2: 4,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: lt,
			player2: ac,
			gameDate: new Date(2015, 11, 10, 15, 50, 55),
			scorePlayer1: 10,
			scorePlayer2: 2,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: lt,
			player2: rk,
			gameDate: new Date(2015, 11, 10, 15, 50, 56),
			scorePlayer1: 10,
			scorePlayer2: 6,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: av,
			player2: ac,
			gameDate: new Date(2015, 11, 10, 15, 50, 57),
			scorePlayer1: 10,
			scorePlayer2: 3,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: lt,
			player2: ol,
			gameDate: new Date(2015, 11, 10, 15, 50, 58),
			scorePlayer1: 12,
			scorePlayer2: 10,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: av,
			player2: mp,
			gameDate: new Date(2015, 11, 10, 15, 50, 59),
			scorePlayer1: 10,
			scorePlayer2: 3,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: av,
			player2: jf,
			gameDate: new Date(2015, 11, 10, 15, 51, 11),
			scorePlayer1: 10,
			scorePlayer2: 2,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: jf,
			player2: ml,
			gameDate: new Date(2015, 11, 17, 15, 51, 11),
			scorePlayer1: 10,
			scorePlayer2: 8,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: lt,
			player2: jf,
			gameDate: new Date(2015, 11, 17, 15, 51, 12),
			scorePlayer1: 10,
			scorePlayer2: 5,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: av,
			player2: ac,
			gameDate: new Date(2015, 11, 17, 15, 51, 13),
			scorePlayer1: 10,
			scorePlayer2: 4,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: av,
			player2: ml,
			gameDate: new Date(2015, 11, 17, 15, 51, 14),
			scorePlayer1: 11,
			scorePlayer2: 9,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: av,
			player2: mz,
			gameDate: new Date(2015, 11, 17, 15, 51, 15),
			scorePlayer1: 10,
			scorePlayer2: 5,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: ac,
			player2: lt,
			gameDate: new Date(2015, 11, 17, 15, 51, 16),
			scorePlayer1: 10,
			scorePlayer2: 7,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: ac,
			player2: ml,
			gameDate: new Date(2015, 11, 17, 15, 51, 17),
			scorePlayer1: 11,
			scorePlayer2: 9,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: av,
			player2: lt,
			gameDate: new Date(2015, 11, 17, 15, 51, 18),
			scorePlayer1: 10,
			scorePlayer2: 6,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: av,
			player2: jf,
			gameDate: new Date(2015, 11, 17, 15, 51, 19),
			scorePlayer1: 10,
			scorePlayer2: 8,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: av,
			player2: mp,
			gameDate: new Date(2015, 11, 17, 15, 51, 20),
			scorePlayer1: 10,
			scorePlayer2: 3,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: av,
			player2: ac,
			gameDate: new Date(2015, 11, 17, 15, 51, 21),
			scorePlayer1: 10,
			scorePlayer2: 4,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: jf,
			player2: ct,
			gameDate: new Date(2015, 11, 18, 15, 51, 11),
			scorePlayer1: 10,
			scorePlayer2: 3,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: jf,
			player2: sk,
			gameDate: new Date(2015, 11, 18, 15, 51, 12),
			scorePlayer1: 10,
			scorePlayer2: 6,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: ml,
			player2: ct,
			gameDate: new Date(2015, 11, 18, 15, 51, 13),
			scorePlayer1: 10,
			scorePlayer2: 7,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: ml,
			player2: sk,
			gameDate: new Date(2015, 11, 18, 15, 51, 14),
			scorePlayer1: 10,
			scorePlayer2: 6,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: jf,
			player2: ml,
			gameDate: new Date(2015, 11, 18, 15, 51, 15),
			scorePlayer1: 10,
			scorePlayer2: 8,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: lt,
			player2: ml,
			gameDate: new Date(2016, 0, 11, 15, 51, 11),
			scorePlayer1: 10,
			scorePlayer2: 8,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: lt,
			player2: jf,
			gameDate: new Date(2016, 0, 11, 15, 51, 12),
			scorePlayer1: 10,
			scorePlayer2: 6,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: lt,
			player2: ct,
			gameDate: new Date(2016, 0, 11, 15, 51, 13),
			scorePlayer1: 10,
			scorePlayer2: 4,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: lt,
			player2: av,
			gameDate: new Date(2016, 0, 11, 15, 51, 14),
			scorePlayer1: 10,
			scorePlayer2: 7,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: lt,
			player2: jf,
			gameDate: new Date(2016, 0, 15, 15, 51, 11),
			scorePlayer1: 10,
			scorePlayer2: 7,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: lt,
			player2: jf,
			gameDate: new Date(2016, 0, 15, 15, 51, 12),
			scorePlayer1: 10,
			scorePlayer2: 5,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: lt,
			player2: jf,
			gameDate: new Date(2016, 0, 15, 15, 51, 13),
			scorePlayer1: 10,
			scorePlayer2: 5,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: ac,
			player2: ol,
			gameDate: new Date(2016, 0, 22, 15, 51, 11),
			scorePlayer1: 10,
			scorePlayer2: 1,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: ac,
			player2: av,
			gameDate: new Date(2016, 0, 22, 15, 51, 12),
			scorePlayer1: 10,
			scorePlayer2: 7,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: lt,
			player2: jf,
			gameDate: new Date(2016, 0, 25, 15, 51, 11),
			scorePlayer1: 10,
			scorePlayer2: 5,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: ml,
			player2: lt,
			gameDate: new Date(2016, 0, 25, 15, 51, 12),
			scorePlayer1: 10,
			scorePlayer2: 8,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: ml,
			player2: ac,
			gameDate: new Date(2016, 0, 25, 15, 51, 13),
			scorePlayer1: 10,
			scorePlayer2: 8,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: jf,
			player2: ct,
			gameDate: new Date(2016, 0, 25, 15, 51, 14),
			scorePlayer1: 10,
			scorePlayer2: 6,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: ml,
			player2: ct,
			gameDate: new Date(2016, 0, 25, 15, 51, 15),
			scorePlayer1: 10,
			scorePlayer2: 5,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: jf,
			player2: ml,
			gameDate: new Date(2016, 0, 25, 15, 51, 16),
			scorePlayer1: 10,
			scorePlayer2: 5,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: av,
			player2: ct,
			gameDate: new Date(2016, 0, 26, 15, 51, 11),
			scorePlayer1: 10,
			scorePlayer2: 6,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: lt,
			player2: jf,
			gameDate: new Date(2016, 0, 26, 15, 51, 12),
			scorePlayer1: 10,
			scorePlayer2: 8,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: lt,
			player2: av,
			gameDate: new Date(2016, 0, 26, 15, 51, 13),
			scorePlayer1: 10,
			scorePlayer2: 8,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: ml,
			player2: ct,
			gameDate: new Date(2016, 0, 26, 15, 51, 14),
			scorePlayer1: 10,
			scorePlayer2: 3,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: av,
			player2: ml,
			gameDate: new Date(2016, 0, 26, 15, 51, 15),
			scorePlayer1: 10,
			scorePlayer2: 8,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: av,
			player2: jf,
			gameDate: new Date(2016, 0, 26, 15, 51, 16),
			scorePlayer1: 11,
			scorePlayer2: 9,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: lt,
			player2: ml,
			gameDate: new Date(2016, 0, 26, 15, 51, 17),
			scorePlayer1: 10,
			scorePlayer2: 7,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: ol,
			player2: lt,
			gameDate: new Date(2016, 0, 26, 15, 51, 18),
			scorePlayer1: 11,
			scorePlayer2: 9,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: jf,
			player2: ct,
			gameDate: new Date(2016, 0, 29, 15, 51, 11),
			scorePlayer1: 10,
			scorePlayer2: 7,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: ml,
			player2: jf,
			gameDate: new Date(2016, 0, 29, 15, 51, 12),
			scorePlayer1: 10,
			scorePlayer2: 7,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: av,
			player2: ct,
			gameDate: new Date(2016, 0, 29, 15, 51, 13),
			scorePlayer1: 10,
			scorePlayer2: 5,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: av,
			player2: jf,
			gameDate: new Date(2016, 0, 29, 15, 51, 14),
			scorePlayer1: 10,
			scorePlayer2: 8,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: av,
			player2: jf,
			gameDate: new Date(2016, 1, 1, 15, 51, 11),
			scorePlayer1: 10,
			scorePlayer2: 2,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: av,
			player2: jf,
			gameDate: new Date(2016, 1, 1, 15, 51, 12),
			scorePlayer1: 10,
			scorePlayer2: 5,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: av,
			player2: jf,
			gameDate: new Date(2016, 1, 1, 15, 51, 13),
			scorePlayer1: 10,
			scorePlayer2: 5,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: lt,
			player2: jf,
			gameDate: new Date(2016, 1, 4, 15, 51, 11),
			scorePlayer1: 10,
			scorePlayer2: 5,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: jf,
			player2: lt,
			gameDate: new Date(2016, 1, 4, 15, 51, 12),
			scorePlayer1: 11,
			scorePlayer2: 9,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: lt,
			player2: jf,
			gameDate: new Date(2016, 1, 4, 15, 51, 13),
			scorePlayer1: 10,
			scorePlayer2: 6,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: ml,
			player2: jf,
			gameDate: new Date(2016, 1, 4, 15, 51, 14),
			scorePlayer1: 12,
			scorePlayer2: 10,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: jf,
			player2: ac,
			gameDate: new Date(2016, 1, 8, 15, 51, 11),
			scorePlayer1: 10,
			scorePlayer2: 7,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: jf,
			player2: av,
			gameDate: new Date(2016, 1, 8, 15, 51, 12),
			scorePlayer1: 10,
			scorePlayer2: 6,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: jf,
			player2: ct,
			gameDate: new Date(2016, 1, 8, 15, 51, 13),
			scorePlayer1: 10,
			scorePlayer2: 3,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: av,
			player2: ct,
			gameDate: new Date(2016, 1, 8, 15, 51, 14),
			scorePlayer1: 10,
			scorePlayer2: 5,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: av,
			player2: ac,
			gameDate: new Date(2016, 1, 8, 15, 51, 15),
			scorePlayer1: 10,
			scorePlayer2: 7,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: ol,
			player2: ac,
			gameDate: new Date(2016, 1, 8, 15, 51, 16),
			scorePlayer1: 10,
			scorePlayer2: 7,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: av,
			player2: jf,
			gameDate: new Date(2016, 1, 15, 15, 51, 17),
			scorePlayer1: 10,
			scorePlayer2: 8,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: lt,
			player2: av,
			gameDate: new Date(2016, 1, 15, 15, 51, 18),
			scorePlayer1: 12,
			scorePlayer2: 10,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: ct,
			player2: lt,
			gameDate: new Date(2016, 1, 15, 15, 51, 19),
			scorePlayer1: 10,
			scorePlayer2: 7,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: ct,
			player2: sk,
			gameDate: new Date(2016, 1, 15, 15, 51, 20),
			scorePlayer1: 10,
			scorePlayer2: 0,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: jf,
			player2: ct,
			gameDate: new Date(2016, 1, 15, 15, 51, 21),
			scorePlayer1: 10,
			scorePlayer2: 6,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: jf,
			player2: av,
			gameDate: new Date(2016, 1, 15, 15, 51, 22),
			scorePlayer1: 10,
			scorePlayer2: 6,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: jf,
			player2: av,
			gameDate: new Date(2016, 1, 15, 15, 51, 23),
			scorePlayer1: 14,
			scorePlayer2: 12,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: av,
			player2: lt,
			gameDate: new Date(2016, 1, 15, 15, 51, 24),
			scorePlayer1: 10,
			scorePlayer2: 6,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: jf,
			player2: lt,
			gameDate: new Date(2016, 1, 16, 15, 51, 11),
			scorePlayer1: 10,
			scorePlayer2: 3,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: jf,
			player2: ct,
			gameDate: new Date(2016, 1, 16, 15, 51, 12),
			scorePlayer1: 10,
			scorePlayer2: 4,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: jf,
			player2: sk,
			gameDate: new Date(2016, 1, 16, 15, 51, 13),
			scorePlayer1: 10,
			scorePlayer2: 5,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: av,
			player2: jf,
			gameDate: new Date(2016, 1, 16, 15, 51, 14),
			scorePlayer1: 10,
			scorePlayer2: 8,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: lt,
			player2: av,
			gameDate: new Date(2016, 1, 16, 15, 51, 15),
			scorePlayer1: 11,
			scorePlayer2: 9,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: jf,
			player2: lt,
			gameDate: new Date(2016, 1, 16, 15, 51, 16),
			scorePlayer1: 10,
			scorePlayer2: 4,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: jf,
			player2: lt,
			gameDate: new Date(2016, 1, 18, 15, 51, 17),
			scorePlayer1: 10,
			scorePlayer2: 1,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: jf,
			player2: ct,
			gameDate: new Date(2016, 1, 18, 15, 51, 18),
			scorePlayer1: 10,
			scorePlayer2: 2,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: jf,
			player2: sk,
			gameDate: new Date(2016, 1, 18, 15, 51, 19),
			scorePlayer1: 10,
			scorePlayer2: 5,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: jf,
			player2: av,
			gameDate: new Date(2016, 1, 18, 15, 51, 20),
			scorePlayer1: 10,
			scorePlayer2: 6,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: jf,
			player2: ml,
			gameDate: new Date(2016, 1, 18, 15, 51, 21),
			scorePlayer1: 10,
			scorePlayer2: 7,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: jf,
			player2: lt,
			gameDate: new Date(2016, 1, 18, 15, 51, 22),
			scorePlayer1: 10,
			scorePlayer2: 6,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: av,
			player2: jf,
			gameDate: new Date(2016, 1, 18, 15, 51, 23),
			scorePlayer1: 10,
			scorePlayer2: 8,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: jf,
			player2: lt,
			gameDate: new Date(2016, 1, 18, 15, 51, 24),
			scorePlayer1: 10,
			scorePlayer2: 5,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: ml,
			player2: lt,
			gameDate: new Date(2016, 1, 18, 15, 51, 25),
			scorePlayer1: 10,
			scorePlayer2: 6,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: jf,
			player2: ml,
			gameDate: new Date(2016, 1, 18, 15, 51, 26),
			scorePlayer1: 10,
			scorePlayer2: 6,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: ml,
			player2: av,
			gameDate: new Date(2016, 1, 18, 15, 51, 27),
			scorePlayer1: 16,
			scorePlayer2: 14,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: ct,
			player2: jf,
			gameDate: new Date(2016, 1, 18, 15, 51, 28),
			scorePlayer1: 12,
			scorePlayer2: 10,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: av,
			player2: lt,
			gameDate: new Date(2016, 1, 19, 15, 51, 11),
			scorePlayer1: 10,
			scorePlayer2: 5,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: av,
			player2: jf,
			gameDate: new Date(2016, 1, 19, 15, 51, 12),
			scorePlayer1: 10,
			scorePlayer2: 4,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: av,
			player2: ac,
			gameDate: new Date(2016, 1, 19, 15, 51, 13),
			scorePlayer1: 10,
			scorePlayer2: 5,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: av,
			player2: ct,
			gameDate: new Date(2016, 1, 19, 15, 51, 14),
			scorePlayer1: 10,
			scorePlayer2: 2,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: ml,
			player2: av,
			gameDate: new Date(2016, 1, 19, 15, 51, 15),
			scorePlayer1: 10,
			scorePlayer2: 2,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: av,
			player2: mz,
			gameDate: new Date(2016, 1, 24, 15, 50, 53),
			scorePlayer1: 10,
			scorePlayer2: 2,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: av,
			player2: lt,
			gameDate: new Date(2016, 1, 24, 15, 46, 56),
			scorePlayer1: 10,
			scorePlayer2: 2,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: jf,
			player2: av,
			gameDate: new Date(2016, 1, 24, 15, 44, 59),
			scorePlayer1: 10,
			scorePlayer2: 3,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: lt,
			player2: ml,
			gameDate: new Date(2016, 1, 24, 15, 43, 41),
			scorePlayer1: 10,
			scorePlayer2: 5,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: av,
			player2: ct,
			gameDate: new Date(2016, 1, 24, 15, 34, 7),
			scorePlayer1: 10,
			scorePlayer2: 2,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: ct,
			player2: ml,
			gameDate: new Date(2016, 1, 24, 15, 32, 23),
			scorePlayer1: 10,
			scorePlayer2: 7,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: lt,
			player2: mz,
			gameDate: new Date(2016, 1, 24, 15, 32, 23),
			scorePlayer1: 10,
			scorePlayer2: 3,
			championshipId: twengaChampionship,
			addedBy: jf
		}, {
			player1: ct,
			player2: lt,
			gameDate: new Date(2016, 1, 24, 15, 31, 29),
			scorePlayer1: 15,
			scorePlayer2: 13,
			championshipId: twengaChampionship,
			addedBy: jf
		}];
		gamesList.map((cur, index, array) => {
			Meteor.call('addAChampionshipGame', cur, (error, result) => {
				if (error) {
					console.log(error.message, error);
				} else {
					console.log('addAChampionshipGame : ' + result + ' : Done');
				}
			});
		});
	}
});
