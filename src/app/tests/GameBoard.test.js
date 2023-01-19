import GameBoard from '../models/GameBoard';

let testBoard = new GameBoard();

it('Instantiates board object correctly', () => {
  expect(testBoard.board.length).toBe(100);
  for (const cell of testBoard.board) {
    expect(cell).toEqual({ ship: null, isShot: false });
  }
});

describe('Should place ships at the correct coordinates', () => {
  it('places ship correctly on x-axis', () => {
    testBoard.placeShip('carrier', 0, 'x');

    for (const cell of testBoard.board.slice(0, 5)) {
      expect(cell.ship).toBe('carrier');
    }
  });

  it('places ship correctly on y-axis', () => {
    testBoard.placeShip('patrolBoat', 10, 'y');

    for (const cell of [10, 20].map((i) => testBoard.board[i])) {
      expect(cell.ship).toBe('patrolBoat');
    }
  });

  it('does not allow out-of-bounds placement', () => {
    expect(testBoard.placeShip('battleship', 9, 'x')).toBe(false);
  });

  it('does not allow placement overlapping other ships', () => {
    expect(testBoard.placeShip('submarine', 10, 'x')).toBe(false);
  });

  describe('records hits and misses correctly', () => {
    it('records and increases hit at occupied cell', () => {
      testBoard.receiveAttack(4);

      expect(testBoard.board[4].isShot).toBe(true);
      expect(testBoard.shipAt(4).hits).toBe(1);
    });

    it('records a miss at empty cell', () => {
      testBoard.receiveAttack(99);

      expect(testBoard.isShotHit(99)).toBe(false);
    });
  });

  it('should report whether or not all ships have been sunk', () => {
    testBoard = new GameBoard();

    Object.keys(testBoard.ships).forEach((shipName) => {
      const ship = testBoard.ships[shipName];

      for (let i = 0; i < ship.length; i += 1) {
        ship.hit();
      }
    });

    expect(testBoard.shipsSunk()).toBe(5);
  });
});
