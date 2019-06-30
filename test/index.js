const assert = require('assert')
const Wrenpack = require('..')

describe('Wrenpack', function () {
	const wren = new Wrenpack(__dirname + '/simple/index.wren')
	it('.pack()', function () {
		const out = wren.pack()
		assert(out.includes('// import "../Beverage" for Beverage'))
		assert(out.includes('// import "Beverages/Coffee" for Coffee'))
	})

	it('.pack(true)', function() {
		const out = wren.pack(true)
		assert(!out.includes('// import "../Beverage" for Beverage'))
		assert(!out.includes('// import "Beverages/Coffee" for Coffee'))
	})

	it('.pack(true, "// Hello World!")', function() {
		const out = wren.pack(true, '// Hello World!')
		assert(out.includes('// Hello World!'))
	})
})
