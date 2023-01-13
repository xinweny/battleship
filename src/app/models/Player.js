const GameBoard = require('./GameBoard');

class Player {
  constructor(ai) {
    this.board = new GameBoard();
    this.ships = this.board.ships;
    this.name = ai ? 'p2' : 'p1';
    this.movesMade = [];

    if (ai) {
      this.AI = ai;
    }
  }

  fireShot(opponent, loc) {
    const moveInfo = opponent.board.receiveAttack(loc);
    this.movesMade.push(moveInfo);

    return moveInfo;
  }

  getCell(loc) {
    return this.board.board[loc];
  }
}

module.exports = Player;
