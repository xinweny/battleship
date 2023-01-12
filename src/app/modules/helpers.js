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
