const GameBoard = require('./GameBoard');

class Player {
  constructor(ai) {
    this.board = new GameBoard();
    this.ships = this.board.ships;

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
