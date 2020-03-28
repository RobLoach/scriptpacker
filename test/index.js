const assert = require('assert')
const ScriptPacker = require('..')

describe('ScriptPacker', function () {

	describe('wren', function() {
		const scriptpacker = new ScriptPacker(__dirname + '/wren/index.wren')
		it('.pack()', function () {
			const out = scriptpacker.pack()
			assert(out.includes('// import "../Beverage" for Beverage'))
			assert(out.includes('// import "Beverages/Coffee" for Coffee'))
		})

		it('.pack(true)', function() {
			const out = scriptpacker.pack(true)
			assert(!out.includes('// import "../Beverage" for Beverage'))
			assert(!out.includes('// import "Beverages/Coffee" for Coffee'))
		})

		it('.pack(true, "// Hello World!")', function() {
			const out = scriptpacker.pack(true, '// Hello World!')
			assert(out.includes('// Hello World!'))
		})
	})

	describe('squirrel', function() {
		const scriptpacker = new ScriptPacker(__dirname + '/squirrel/index.nut')
		it('.pack()', function () {
			const out = scriptpacker.pack()
			assert(out.includes('// import("../Beverage")'))
			assert(out.includes('// import("Beverages/Coffee")'))
		})

		it('.pack(true)', function() {
			const out = scriptpacker.pack(true)
			assert(!out.includes('// import("../Beverage")'))
			assert(!out.includes('// import("Beverages/Coffee")'))
		})

		it('.pack(true, "// Hello World!")', function() {
			const out = scriptpacker.pack(true, '// Hello World!')
			assert(out.includes('// Hello World!'))
		})
	})

	describe('chaiscript', function() {
		const scriptpacker = new ScriptPacker(__dirname + '/chaiscript/index.chai')
		it('.pack()', function () {
			const out = scriptpacker.pack()
			assert(out.includes('// require("../Beverage")'))
			assert(out.includes('// require("Beverages/Coffee")'))
		})

		it('.pack(true)', function() {
			const out = scriptpacker.pack(true)
			assert(!out.includes('// require("../Beverage")'))
			assert(!out.includes('// require("Beverages/Coffee")'))
		})

		it('.pack(true, "// Hello World!")', function() {
			const out = scriptpacker.pack(true, '// Hello World!')
			assert(out.includes('// Hello World!'))
		})
	})

	describe('lua', function() {
		const scriptpacker = new ScriptPacker(__dirname + '/lua/init.lua')
		it('.pack()', function () {
			const out = scriptpacker.pack()
			assert(out.includes('-- require "../Beverage"'))
			assert(out.includes('-- require "Beverages/Coffee"'))
		})
		it('.pack(true)', function() {
			const out = scriptpacker.pack(true)
			assert(!out.includes('-- require "../Beverage"'))
			assert(!out.includes('-- require "Beverages/Coffee"'))
		})
		it('.pack(true, "-- Hello World!")', function() {
			const out = scriptpacker.pack(true, '-- Hello World!')
			assert(out.includes('-- Hello World!'))
		})
	})
})
