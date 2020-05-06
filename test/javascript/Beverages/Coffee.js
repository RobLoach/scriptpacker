require("../Beverage")

class Coffee {

	constructor() {
		this.bev = new Beverage()
	}

	drink() {
		this.bev.drink()
		console.log("Delicious Coffee!")
	}
}