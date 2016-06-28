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

export const worldPointsForAGame = function(winnerPoints, looserPoints) {
	let win = 0;
	let loose = 0;
	if (winnerPoints - looserPoints === 2) {
		win += 2;
		loose += 2;
	}
	if (winnerPoints > 10) {
		win += 2;
		loose += 2;
	}
	if (looserPoints <= 2) {
		win += 3;
	}
	return {
		win,
		loose
	};
};

export const kEqualForBothPlayers = function(kForWinner, kForLooser) {
	// Check the params of the function
	check(kForWinner, Number);
	check(kForLooser, Number);

	if (kForWinner === kForLooser) {
		return true;
	} else {
		return false;
	}
};

export const last10GamesPerf = function(playerPoints) {
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

export const lastXGames = function(playerPoints, numberOfResultsToBeDisplayedInTheGraph) {
	// Check the params of the function
	check(playerPoints, Array);
	var list = [];
	if (playerPoints.length > numberOfResultsToBeDisplayedInTheGraph - 1) {
		list = playerPoints.slice(-numberOfResultsToBeDisplayedInTheGraph);
		return list;
	} else {
		return playerPoints;
	}
};

export const fullName = function(userProfile) {
	return userProfile.firstName + ' ' + userProfile.lastName.charAt(0) + '.';
};

export const over10 = function(player1Score) {
	if (player1Score > 10) {
		return true;
	} else {
		return false;
	}
};
