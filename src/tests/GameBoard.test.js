const GameBoard = require('../factories/GameBoard');

it('Instantiates object correctly', () => {
	const board = GameBoard();

	expect(board.board.length).toBe(100);
	for (const cell of board.board) {
		expect(cell).toEqual({ hasShip: false, isShot: false });
	}
});