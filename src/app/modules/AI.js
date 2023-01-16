import {
  randElement,
  getActiveShips,
  shipLengths,
  checkCollisionsAI,
} from './helpers';

class AI {
  constructor(oppBoard) {
    this.cellsHit = {
      carrier: [],
      battleship: [],
      cruiser: [],
      submarine: [],
      patrolBoat: [],
    };

    this.oppBoard = oppBoard;
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

    const { ship } = prevMove;

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
        // Otherwise make smart guess
        const hiddenShipLengths = this.getUndiscoveredShipLengths();
        const shipLength = randElement(hiddenShipLengths); // Pick random undiscovered ship

        // Get all valid placements on the board for that ship
        const validLocs = this.modelValidPlacements(shipLength);

        // Pick random element of randomly selected location array
        loc = randElement(randElement(validLocs));
      }
    }

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

  modelValidPlacements(length) {
    const validLocs = [];

    const emptyLocs = this.getEmptyLocs();

    // Check
    for (const emptyLoc of emptyLocs) {
      for (const offset of [1, 10]) {
        const locs = [...Array(length).keys()].map((i) => emptyLoc + (offset * i));

        if (checkCollisionsAI(locs, offset, this.oppBoard)) validLocs.push(locs);
      }
    }

    return validLocs;
  }

  checkValidMove(start, offset) {
    const end = start + offset;

    if (end < 0 || end > 99) return false;

    // Check if move has already been made
    if (this.oppBoard[end].isShot) return false;

    const lastStartDigit = start.toString().slice(-1)[0];

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

  getUndiscoveredShipLengths() {
    const hiddenShipLengths = [];

    Object.keys(this.cellsHit).forEach((shipName) => {
      const shipLength = shipLengths[shipName];

      if (this.cellsHit[shipName].length === 0) hiddenShipLengths.push(shipLength);
    });

    return hiddenShipLengths;
  }

  getEmptyLocs() {
    return this.oppBoard.filter((cell) => !cell.isShot)
      .map((cell) => this.oppBoard.indexOf(cell));
  }
}

export default AI;
