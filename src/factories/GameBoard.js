const gameboardActions = {
	placeShip: function(ship, start, axis) {
		for (i = 0; i < ship.length; i++) {
			let loc = (axis === 'x') ? start + i : start + (i * 10);
			this.board[loc].ship = ship.name;
		}
	}
};

const GameBoard = () => {
	function initBoard() {
		let board = [];

		for (i = 0; i < 100; i++) {
			board.push({ ship: null, isShot: false });
		}

		return board;
	}

	let gameboard = Object.create(gameboardActions);
	gameboard.board = initBoard();

	return gameboard;
};

module.exports = GameBoard;