export function checkCollisions(locs, axis, board) {
  if (axis === 'x') {
    const locsStr = locs.map((loc) => loc.toString());
    const firstLoc = locsStr[0];

    if (firstLoc.length === 1) {
      if (!(locsStr.every((loc) => loc.length === firstLoc.length))) return false;
    } else if (!(locsStr.every((loc) => loc[0] === locsStr[0][0]))) {
      return false;
    }
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
