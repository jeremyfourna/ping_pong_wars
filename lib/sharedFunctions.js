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

addAndRemovePointsForUsers = function(winner, looser, pointsForTheWinner, pointsForTheLooser) {
	// Check the params of the function
	check(winner, String);
	check(looser, String);
	check(pointsForTheWinner, Number);
	check(pointsForTheLooser, Number);

	Meteor.users.update({ _id: winner }, {
		$push: {
			'profile.points': pointsForTheWinner
		}
	});
	Meteor.users.update({ _id: looser }, {
		$push: {
			'profile.points': pointsForTheLooser
		}
	});
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
