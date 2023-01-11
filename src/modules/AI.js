class AI {
	randomShot(opponent) {
		const oppBoard = opponent.board;
		const legalMoves = oppBoard.board.filter(cell => !cell.isShot).map(cell => oppBoard.board.indexOf(cell));

		const loc = legalMoves[Math.floor(Math.random() * legalMoves.length)];
		oppBoard.receiveAttack(loc);

		return loc;
	}
}

module.exports = AI;