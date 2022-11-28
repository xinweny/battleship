const gameboardActions = {

};

const GameBoard = () => {
	function initBoard() {
		let board = [];

		for (i = 0; i < 100; i++) {
			board.push({ hasShip: false, isShot: false });
		}

		return board;
	}

	let gameboard = Object.create(gameboardActions);
	gameboard.board = initBoard();

	return gameboard;
};

module.exports = GameBoard;