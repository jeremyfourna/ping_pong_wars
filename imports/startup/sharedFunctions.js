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

export const pointBase = function(playerNbGames, currentPoints) {
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

export const pointsDifference = function(winnerPoints, looserPoints) {
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

last10GamesPerf = function(playerPoints) {
	// Check the params of the function
	check(playerPoints, Array);
	var list = [];
	var first = 0;
	var end = 0;
	if (playerPoints.length > 10) {
		list = playerPoints.slice(-11);
		first = list[0];
		end = list[10];
		return end - first;
	} else {
		first = playerPoints[0];
		end = lodash.last(playerPoints);
		return end - first;
	}
};

last5Games = function(playerPoints) {
	// Check the params of the function
	check(playerPoints, Array);
	var list = [];
	if (playerPoints.length > 4) {
		list = playerPoints.slice(-5);
		return list;
	} else {
		return playerPoints;
	}
};

fullName = function(userProfile) {
	return userProfile.firstName + ' ' + userProfile.lastName.charAt(0) + '.';
};
