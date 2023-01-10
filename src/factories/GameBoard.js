const Ship = require('../factories/Ship');

const gameboardActions = {
	placeShip(shipName, start, axis) {
		const ship = this.ships[shipName];

		for (i = 0; i < ship.length; i++) {
			let loc = (axis === 'x') ? start + i : start + (i * 10);

			if (loc >= 100 || this.board[loc].ship != null) {
				throw new Error('Invalid placement');
			} else {
				this.board[loc].ship = ship.name;
			}
		}
	},
	isShotHit(loc) {
		return this.board[loc].isShot && this.board[loc].ship != null;
	},
	receiveAttack(loc) {
		this.board[loc].isShot = true;

		const ship = this.board[loc].ship;

		if (ship) {
			this.ships[ship].hit();
		}
	},
	shipAt(loc) {
		return this.ships[this.board[loc].ship];
	},
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

	gameboard.ships = {
		carrier: Ship(5, 'carrier'),
		battleship: Ship(4, 'battleship'),
		cruiser: Ship(3, 'cruiser'),
		submarine: Ship(3, 'submarine'),
		patrolBoat: Ship(2, 'patrolBoat'),
	};

	return gameboard;
};

module.exports = GameBoard;