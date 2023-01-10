const Ship = require('../factories/Ship');

const gameboardActions = {
	initBoard() {
		this.board = [];

		for (i = 0; i < 100; i++) {
			this.board.push({ ship: null, isShot: false });
		}
	},
	placeShip(shipName, start, axis) {
		const ship = this.ships[shipName];

		for (i = 0; i < ship.length; i++) {
			let loc = (axis === 'x') ? start + i : start + (i * 10);

			if (loc >= 100 || this.board[loc].ship != null) {
				return false;
			} else {
				this.board[loc].ship = ship.name;
			}
		}
	},
	isShotHit(loc) {
		return this.board[loc].isShot && this.board[loc].ship != null;
	},
	receiveAttack(loc) {
		if (!this.board[loc].isShot) {
			this.board[loc].isShot = true;

			const ship = this.board[loc].ship;
	
			if (ship) {
				this.ships[ship].hit();
			} else {
				this.misses.push(loc);
			}
		}
	},
	shipAt(loc) {
		return this.ships[this.board[loc].ship];
	},
	shipsSunk() {
		let sunk = 0;

		for (const ship in this.ships) {
			if (this.ships[ship].isSunk()) {
				sunk += 1;
			}
		}

		return sunk;
	},
	clear() {
		this.initBoard();

		for (const [shipName, ship] of Object.entries(this.ships)) {
			ship.hits = 0;
			ship.sunk = false;
		}

		this.misses = [];
	}
};

const GameBoard = () => {
	let gameboard = Object.create(gameboardActions);

	gameboard.initBoard();

	gameboard.ships = {
		carrier: Ship(5, 'carrier'),
		battleship: Ship(4, 'battleship'),
		cruiser: Ship(3, 'cruiser'),
		submarine: Ship(3, 'submarine'),
		patrolBoat: Ship(2, 'patrolBoat'),
	};

	gameboard.misses = [];

	return gameboard;
};

module.exports = GameBoard;