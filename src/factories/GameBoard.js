const Ship = require('../factories/Ship');

class GameBoard {
	constructor() {
		this.board = [];

		for (let i = 0; i < 100; i++) {
			this.board.push({ ship: null, isShot: false });
		}

		this.ships = {
			carrier: new Ship(5, 'carrier'),
			battleship: new Ship(4, 'battleship'),
			cruiser: new Ship(3, 'cruiser'),
			submarine: new Ship(3, 'submarine'),
			patrolBoat: new Ship(2, 'patrolBoat'),
		};
	
		this.misses = [];
	}

	placeShip(shipName, start, axis) {
		const ship = this.ships[shipName];

		for (let i = 0; i < ship.length; i++) {
			let loc = (axis === 'x') ? start + i : start + (i * 10);

			if (loc >= 100 || this.board[loc].ship != null) {
				return false;
			} else {
				this.board[loc].ship = ship.name;
			}
		}
	}

	isShotHit(loc) {
		return this.board[loc].isShot && this.board[loc].ship != null;
	}

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
	}

	shipAt(loc) {
		return this.ships[this.board[loc].ship];
	}
	
	shipsSunk() {
		let sunk = 0;

		for (const ship in this.ships) {
			if (this.ships[ship].isSunk()) {
				sunk += 1;
			}
		}

		return sunk;
	}
}

module.exports = GameBoard;