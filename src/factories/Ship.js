const shipActions = {
	hit() {
		this.hits = this.hits + 1;

		if (this.hits == this.length) {
			this.sunk = true;
		}
	},
	isSunk() {
		return this.sunk;
	},
};

const Ship = (length, name) => {
	let ship = Object.create(shipActions);

	ship.length = length;
	ship.hits = 0;
	ship.name = name;
	ship.sunk = false;

	return ship;
};

module.exports = Ship;