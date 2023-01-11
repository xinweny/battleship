const GameBoard = require('./GameBoard');

class Player {
  constructor(ai) {
    this.board = new GameBoard();
    this.ships = this.board.ships;
    this.name = ai ? 'p2' : 'p1';

    if (ai) {
      this.AI = ai;
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
