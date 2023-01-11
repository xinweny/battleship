const GameBoard = require('./GameBoard');
const AI = require('../modules/AI');

class Player {
	constructor(isComp) {
		this.board = new GameBoard();
		this.ships = this.board.ships;
		this.turn = !isComp;

		if (isComp) {
			this.AI = new AI();
		}
	}

	fireShot(opponent, loc) {
		opponent.board.receiveAttack(loc);
	}

	getCell(loc) {
		return this.board.board[loc];
	}
}

module.exports = Player;