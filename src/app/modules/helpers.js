export function checkCollisions(locs, axis, board) {
  if (axis === 'x') {
    const locsStr = locs.map((loc) => loc.toString());

    if (locsStr.some((loc) => loc.slice(-1) === '9' && locsStr.indexOf(loc) !== (locsStr.length - 1))) return false;
  } else {
    for (const loc of locs) {
      if (loc > 99) return false;
    }
  }

  for (const loc of locs) {
    if (board[loc].ship != null) {
      return false;
    }
  }

  return true;
}

export function createElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;

  return element;
}

export function getCellColor(outcome, i) {
  const opp = outcome.opponent;
  const oppBoard = opp.board.board;

  let color = null;

  if (oppBoard[i].ship && oppBoard[i].isShot) {
    color = 'green';
  } else if (oppBoard[i].ship && opp.name === 'p1') {
    color = 'gray';
  } else if (oppBoard[i].ship === null && oppBoard[i].isShot) {
    color = 'red';
  }

  return color;
}

export function checkForWinner(outcome) {
  if (outcome.winner) {
    const player = (outcome.opponent.name === 'p1') ? 'Computer' : 'Player';
    console.log(`${player} wins!`);
  }
}
