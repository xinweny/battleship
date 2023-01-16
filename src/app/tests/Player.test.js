const Player = require('../models/Player');
const GameBoard = require('../models/GameBoard');
const AI = require('../modules/AI');

const player = new Player();
const computer = new Player(new AI(player.board.board));

computer.board.placeShip('carrier', 4, 'x');
computer.board.placeShip('battleship', 12, 'y');
computer.board.placeShip('cruiser', 97, 'x');
computer.board.placeShip('submarine', 66, 'y');
computer.board.placeShip('patrolBoat', 39, 'x');

describe('player tests', () => {
  it('initialises player correctly', () => {
    expect(player.board).toEqual(new GameBoard());
  });

  it('can attack opponent board', () => {
    player.fireShot(computer, 5);

    expect(computer.getCell(5).isShot).toBe(true);
    expect(computer.ships.carrier.hits).toBe(1);
  });
});

describe('computer tests', () => {
  it('can make random, legal moves', () => {
    const loc = computer.AI.getRandomShot(computer.movesMade);
    computer.fireShot(player, loc);

    expect(player.getCell(loc).isShot).toBe(true);
  });
});
