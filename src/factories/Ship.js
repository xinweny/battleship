class Ship {
	constructor(length, name) {
		this.length = length;
		this.name = name;
		this.hits = 0;
		this.sunk = false;
	}

	hit() {
		this.hits = this.hits + 1;

		if (this.hits == this.length) {
			this.sunk = true;
		}
	}

	isSunk() {
		return this.sunk;
	}
}

module.exports = Ship;