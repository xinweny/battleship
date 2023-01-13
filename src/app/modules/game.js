import Player from '../models/Player';
import View from './view';
import AI from './AI';

class Game {
  constructor() {
    this.p1 = new Player(); // Human player
    this.p2 = new Player(new AI()); // Computer

    this.view = new View();

    this.turn = 'p1';
    this.winner = null;

    // Place player ships
    this.p1.board.placeShip('carrier', 4, 'x');
    this.p1.board.placeShip('battleship', 12, 'y');
    this.p1.board.placeShip('cruiser', 97, 'x');
    this.p1.board.placeShip('submarine', 66, 'y');
    this.p1.board.placeShip('patrolBoat', 38, 'x');

    // Place computer ships
    // computer.AI.placeShips();
    this.p2.board.placeShip('carrier', 4, 'x');
    this.p2.board.placeShip('battleship', 12, 'y');
    this.p2.board.placeShip('cruiser', 97, 'x');
    this.p2.board.placeShip('submarine', 66, 'y');
    this.p2.board.placeShip('patrolBoat', 38, 'x');
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

      if (this.checkWin(oppBoard)) {
        outcome.winner = this.winner;
      } else {
        this.switchTurn();

        const nextIndex = this.p2.AI.getSmartShot(this.p2.movesMade);
        const cell = this.view.getCell('p1', nextIndex);
        this.p2.AI.clickCell(cell);
      }
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

  init() {
    this.view.renderBoard(this.p1);
    this.view.renderBoard(this.p2);

    this.view.bindOpponentCells(this.playPlayerTurn.bind(this), this.p1);
    this.view.bindOpponentCells(this.playComputerTurn.bind(this), this.p2);
  }
}

export default Game;
