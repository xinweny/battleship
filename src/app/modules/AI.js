import {
  randElement,
  getActiveShips,
} from './helpers';

class AI {
  constructor() {
    this.cellsHit = {
      carrier: [],
      battleship: [],
      cruiser: [],
      submarine: [],
      patrolBoat: [],
    };

    this.modelOppBoard = Array(100).fill(null);
    this.offsets = [-1, 1, -10, 10];
  }

  getRandomShot(movesMade) {
    // Get movesMade object reference from Player with AI module and determine possible moves
    const cellsShot = movesMade.map((move) => move.cell);
    const legalMoves = [...Array(100).keys()].filter((index) => !cellsShot.includes(index));

    const loc = randElement(legalMoves);

    return loc;
  }

  getSmartShot(movesMade) {
    if (movesMade.length === 0) return this.getRandomShot(movesMade); // First shot is random

    let loc = null;

    const prevMove = movesMade.slice(-1)[0];
    const prevCell = prevMove.cell;

    const ship = prevMove.target;

    this.modelOppBoard[prevCell] = prevMove;

    if (ship && !ship.isSunk()) {
      // If previous move hit a ship that is not sunk, update cellsHit to remember the move
      this.cellsHit[ship.name].push(prevCell);

      loc = this.findSuitableMoves(ship);
    } else {
      // Check if there are any other active ships discovered
      const activeShips = getActiveShips(movesMade);

      if (activeShips.length > 0) {
        const prevShip = activeShips.slice(-1)[0];

        // Repeat searching algorithm above
        loc = this.findSuitableMoves(prevShip);
      } else {
        // Otherwise make random move
        loc = this.getRandomShot(movesMade);
      }
    }

    console.log(`loc: ${loc}`);

    return loc;
  }

  findSuitableMoves(ship) {
    const shipCellsHit = this.cellsHit[ship.name];
    const validNextMoves = [];

    if (shipCellsHit.length === 1) {
      // If ship hit once, check valid adjacent left/right/up/down cells
      const cell = shipCellsHit[0];

      for (const offset of this.offsets) {
        if (this.checkValidMove(cell, offset)) validNextMoves.push(cell + offset);
      }
    } else {
      // If ship has > 1 hit, establish limits and axis
      const limits = [Math.min(...shipCellsHit), Math.max(...shipCellsHit)];

      let axisOffsets = null;

      if ((limits[1] - limits[0]) % 10 === 0) {
        axisOffsets = this.offsets.slice(2); // y-axis
      } else {
        axisOffsets = this.offsets.slice(0, 2); // x-axis
      }

      // Check if adjacent cell on same axis is valid
      for (const limit of limits) {
        for (const offset of axisOffsets) {
          if (this.checkValidMove(limit, offset)) {
            validNextMoves.push(limit + offset);
          }
        }
      }
    }

    return randElement(validNextMoves); // Select random next valid move
  }

  checkValidMove(start, offset) {
    const end = start + offset;
    const lastStartDigit = start.toString().slice(-1)[0];

    // Check if move has already been made
    if (this.modelOppBoard[end] !== null) return false;

    // Check edge collision
    if (offset === -1) return !(lastStartDigit === '0'); // left
    if (offset === 1) return !(lastStartDigit === '9'); // right
    if (offset === -10) return !(start < 10); // up
    if (offset === 10) return !(start > 89); // down

    return false;
  }

  clickCell(cell) {
    cell.click();
  }
}

export default AI;
