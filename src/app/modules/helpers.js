export function checkEdgeCollisions(locs, axis) {
  for (const loc of locs) {
    if (loc < 0 || loc > 99) return false;
  }

  if (locs.length === 1) return true;

  if (axis === 'x' || axis === 1 || axis === -1) {
    const locsStr = locs.map((loc) => loc.toString());

    if (locsStr.some((loc) => loc.slice(-1) === '9' && locsStr.indexOf(loc) !== (locsStr.length - 1))) return false;
  }

  return true;
}

export function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) element.className = className;

  return element;
}

export function randElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getActiveShips(movesMade) {
  const shipMoves = movesMade.filter((move) => move.ship != null && !move.ship.isSunk());

  return (shipMoves.length > 0) ? [...new Set(shipMoves.map((move) => move.ship))] : [];
}

export const shipLengths = {
  carrier: 5,
  battleship: 4,
  cruiser: 3,
  submarine: 3,
  patrolBoat: 2,
};

export function getNextShip(currentShip) {
  const shipNames = Object.keys(shipLengths);

  const index = shipNames.indexOf(currentShip);

  if (index < 4) return shipNames[index + 1];

  return shipNames[index];
}

export function projectShipLocs(start, offset, length, shift = 0) {
  return [...Array(length).keys()].map((i) => start + (offset * (i + shift)));
}
