const assert = require('assert')
const Wrenpack = require('..')

describe('Wrenpack', function () {
	const wren = new Wrenpack(__dirname + '/simple/index.wren')
	it('.pack()', function () {
		const out = wren.pack()
		assert(out.includes('// import "../Beverage" for Beverage'))
		assert(out.includes('// import "Beverages/Coffee" for Coffee'))
	})
})
