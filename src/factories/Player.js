const GameBoard = require('../factories/GameBoard');

const playerActions = {
	fireShot(opponent, loc) {
		opponent.board.receiveAttack(loc);
	},
	getCell(loc) {
		return this.board.board[loc];
	}
};

const computerActions = {
	...playerActions,
	randomShot(opponent) {
		const oppBoard = opponent.board;
		const legalMoves = oppBoard.board.filter(cell => !cell.isShot).map(cell => oppBoard.board.indexOf(cell));

		const loc = legalMoves[Math.floor(Math.random() * legalMoves.length)];
		oppBoard.receiveAttack(loc);

		return loc;
	}
};


const Player = (name, isComp=false) => {
	let player = Object.create(isComp ? computerActions : playerActions);

	player.name = name;

	player.board = GameBoard();
	player.ships = player.board.ships;
	player.turn = !isComp;

	return player;
};

module.exports = Player;