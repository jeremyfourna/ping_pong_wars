winner = function(game) {
	if (Number(game.scorePlayer1) > Number(game.scorePlayer2)) {
		return game.player1;
	} else if (Number(game.scorePlayer1) < Number(game.scorePlayer2)) {
		return game.player2;
	} else {
		return null;
	}
};

pointBase = function(playerNbGames, currentPoints) {
	if (playerNbGames < 30) {
		return 40;
	} else if (currentPoints <= 2400) {
		return 20;
	} else {
		return 10;
	}
};

pointsDifference = function(player1Points, player2Points) {
	var diff = Math.abs(player1Points - player2Points);
	if (player1Points - player2Points < 0) {
		if (diff > 400) {
			return -400;
		} else {
			return player1Points - player2Points;
		}
	} else if (player1Points - player2Points > 0) {
		if (diff > 400) {
			return 400;
		} else {
			return player1Points - player2Points;
		}
	} else {
		return 0;
	}
};

kEqualForBothPlayers = function(player1, player2) {
	if (player1 === player2) {
		return true;
	} else {
		return false;
	}
};
