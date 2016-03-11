winner = function(game) {
	// Check the params of the function
	check(game, Object);
	check(game.scorePlayer1, Number);
	check(game.scorePlayer2, Number);
	check(game.player1, String);
	check(game.player2, String);

	if (game.scorePlayer1 > game.scorePlayer2) {
		return game.player1;
	} else if (game.scorePlayer1 < game.scorePlayer2) {
		return game.player2;
	} else {
		return null;
	}
};

looser = function(game) {
	// Check the params of the function
	check(game, Object);
	check(game.scorePlayer1, Number);
	check(game.scorePlayer2, Number);
	check(game.player1, String);
	check(game.player2, String);

	if (game.scorePlayer1 < game.scorePlayer2) {
		return game.player1;
	} else if (game.scorePlayer1 > game.scorePlayer2) {
		return game.player2;
	} else {
		return null;
	}
};

addAndRemovePointsForUsers = function(winner, looser, pointsForTheWinner, pointsForTheLooser, championshipOrTournament, championshipOrTournamentId) {
	// Check the params of the function
	check(winner, String);
	check(looser, String);
	check(pointsForTheWinner, Number);
	check(pointsForTheLooser, Number);
	check(championshipOrTournament, String);
	check(championshipOrTournamentId, String);
	if (championshipOrTournament === 'championship') {
		Meteor.call('addPointsForPlayerInChampionship', championshipOrTournamentId, winner, pointsForTheWinner, function(error, result) {
			if (error) {
				console.log(error.message);
			}
		});
		Meteor.call('addPointsForPlayerInChampionship', championshipOrTournamentId, looser, pointsForTheLooser, function(error, result) {
			if (error) {
				console.log(error.message);
			}
		});
	} else if (championshipOrTournament === 'tournament') {
		Meteor.call('addPointsForPlayerInTournament', championshipOrTournamentId, winner, pointsForTheWinner, function(error, result) {
			if (error) {
				console.log(error.message);
			}
		});
		Meteor.call('addPointsForPlayerInTournament', championshipOrTournamentId, looser, pointsForTheLooser, function(error, result) {
			if (error) {
				console.log(error.message);
			}
		});
	} else {
		console.log('Bas value for championshipOrTournament : ' + championshipOrTournament);
	}
	return true;
};

pointBase = function(playerNbGames, currentPoints) {
	// Check the params of the function
	check(playerNbGames, Number);
	check(currentPoints, Number);

	if (playerNbGames < 30) {
		return 40;
	} else if (currentPoints <= 2400) {
		return 20;
	} else {
		return 10;
	}
};

pointsDifference = function(winnerPoints, looserPoints) {
	// Check the params of the function
	check(winnerPoints, Number);
	check(looserPoints, Number);

	var diff = Math.abs(winnerPoints - looserPoints);
	if (winnerPoints - looserPoints < 0) {
		if (diff > 400) {
			return -400;
		} else {
			return winnerPoints - looserPoints;
		}
	} else if (winnerPoints - looserPoints > 0) {
		if (diff > 400) {
			return 400;
		} else {
			return winnerPoints - looserPoints;
		}
	} else {
		return 0;
	}
};

kEqualForBothPlayers = function(kForWinner, kForLooser) {
	// Check the params of the function
	check(kForWinner, Number);
	check(kForLooser, Number);

	if (kForWinner === kForLooser) {
		return true;
	} else {
		return false;
	}
};
