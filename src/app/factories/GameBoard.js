import Ship from './Ship';

class GameBoard {
  constructor() {
    this.board = [];

    for (let i = 0; i < 100; i += 1) {
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

    for (let i = 0; i < ship.length; i += 1) {
      const loc = (axis === 'x') ? start + i : start + (i * 10);

      if (loc >= 100 || this.board[loc].ship != null) {
        return false;
      }
      this.board[loc].ship = ship.name;
    }

    return true;
  }

  isShotHit(loc) {
    return this.board[loc].isShot && this.board[loc].ship != null;
  }

  receiveAttack(loc) {
    if (!this.board[loc].isShot) {
      this.board[loc].isShot = true;

      const { ship } = this.board[loc];

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

    Object.keys(this.ships).forEach((shipName) => {
      if (this.ships[shipName].isSunk()) {
        sunk += 1;
      }

      return sunk;
    });
  }
}

export default GameBoard;
