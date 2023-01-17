import Player from '../models/Player';
import View from './view';
import AI from './AI';

import { shipLengths, getNextShip } from './helpers';

class Game {
  constructor() {
    this.init();
  }

  init() {
    this.p1 = new Player(); // Human player
    this.p2 = new Player(new AI()); // Computer

    this.view = new View();

    this.turn = 'p1';
    this.winner = null;
    this.placementState = {
      axis: 'x',
      currentShip: 'carrier',
      allShipsPlaced: false,
    };

    // Place computer ships
    this.p2.board.placeShipsRandomly();
  }

  switchTurn() {
    this.turn = (this.turn === 'p1') ? 'p2' : 'p1';
  }

  checkWin(oppBoard) {
    if (oppBoard.shipsSunk() === 5) {
      this.winner = this.turn;
    }

    return this.winner;
  }

  playPlayerTurn(index) {
    if (this.winner != null) return false;

    const oppBoard = this.p2.board;
    const outcome = {
      validMove: false,
      opponent: this.p2,
      winner: null,
    };

    if (!oppBoard.board[index].isShot) {
      outcome.validMove = true;

      this.p1.fireShot(this.p2, index);

      if (!this.checkWin(oppBoard)) {
        this.switchTurn();

        const nextIndex = this.p2.AI.getSmartShot(this.p2.movesMade);
        const cell = this.view.getCell(this.p1.name, nextIndex);
        this.p2.AI.clickCell(nextIndex, cell);
      }

      outcome.winner = this.winner;
    }

    return outcome;
  }

  playComputerTurn(index) {
    if (this.winner != null) return false;

    const outcome = {
      validMove: false,
      opponent: this.p1,
      winner: null,
    };

    if (this.turn === 'p2') {
      outcome.validMove = true;
      this.p2.fireShot(this.p1, index);

      if (this.checkWin(this.p1.board)) {
        outcome.winner = this.winner;
      } else {
        this.switchTurn();
      }
    }

    return outcome;
  }

  checkValidPlacement(i) {
    const outcome = {
      valid: false,
      boardState: this.p1.board.board,
    };

    if (!this.placementState.allShipsPlaced) {
      const shipLength = shipLengths[this.placementState.currentShip];

      const locs = [...Array(shipLength).keys()].map((n) => ((this.placementState.axis === 'x') ? i + n : i + (n * 10)));

      const isValid = this.p1.board.checkCollisions(locs, this.placementState.axis);

      if (isValid) {
        outcome.valid = true;
        outcome.viewLocs = locs;
      } else if (this.placementState.axis === 'y') {
        outcome.viewLocs = locs.filter((loc) => loc < 100);
      } else {
        const firstLoc = locs[0];

        if (firstLoc < 10) {
          outcome.viewLocs = locs.filter((loc) => loc < 10);
        } else {
          outcome.viewLocs = locs.filter((loc) => loc.toString()[0] === firstLoc.toString()[0]);
        }
      }
    }

    return outcome;
  }

  placeShip(index) {
    const info = {};

    this.p1.board.placeShip(this.placementState.currentShip, index, this.placementState.axis);

    info.board = this.p1.board.board;

    if (this.p1.board.getShipsPlaced().length === 5) {
      info.nextShip = null;
      this.placementState.allShipsPlaced = true;
    } else {
      const nextShip = getNextShip(this.placementState.currentShip);
      this.placementState.currentShip = nextShip;
      info.nextShip = nextShip;
    }

    return info;
  }

  togglePlacementAxis() {
    this.placementState.axis = (this.placementState.axis === 'x') ? 'y' : 'x';
  }

  randomizePlayerShips() {
    this.p1.board.initBoard();
    this.p1.board.placeShipsRandomly();

    this.placementState.allShipsPlaced = true;

    return this.p1.board.board;
  }

  resetPlayerBoard() {
    this.p1.board.initBoard();

    this.placementState = {
      axis: 'x',
      currentShip: 'carrier',
      allShipsPlaced: false,
    };

    return this.p1.board.board;
  }

  setupGame() {
    this.view.renderBoard(this.p1);
    this.view.renderStartScreen();

    this.view.bindMouseOverCell(this.checkValidPlacement.bind(this));
    this.view.bindPressSpaceKey(this.togglePlacementAxis.bind(this));
    this.view.bindClickPlacementCell(this.placeShip.bind(this));

    this.view.bindClickRandomButton(this.randomizePlayerShips.bind(this));
    this.view.bindClickResetButton(this.resetPlayerBoard.bind(this));
    this.view.bindClickStartButton(this.startGame.bind(this));
  }

  startGame() {
    this.view.resetBoardEventListeners(this.p1.name);

    this.view.renderBoard(this.p1);
    this.view.renderBoardInfo(this.p1);

    this.view.renderBoard(this.p2);
    this.view.renderBoardInfo(this.p2);

    this.view.bindClickOpponentCell(this.playPlayerTurn.bind(this), this.p1);
    this.view.bindClickOpponentCell(this.playComputerTurn.bind(this), this.p2);
    this.view.bindClickRestartButton(this.restartGame.bind(this));
  }

  restartGame() {
    this.init();

    this.setupGame();
  }
}

export default Game;
