const fs = require('fs')
const path = require('path')
const md5 = require('md5')

const reservedModules = [
	'random',
	'core',
	'io'
]

class Wrenpack {

	constructor(input = 'index.wren', dir = '') {
		this.baseDir = dir ? dir : path.dirname(input)
		this.input = path.basename(input)
		this.regex = /import \"([a-zA-Z\.\/]*)\".*\n/g
	}

	modules() {
		if (!fs.existsSync(path.join(this.baseDir, this.input))) {
			return []
		}
		let modules = []
		let replaceCode = []
		this.code = fs.readFileSync(path.join(this.baseDir, this.input))
		let m
		while ((m = this.regex.exec(this.code)) !== null) {
			// This is necessary to avoid infinite loops with zero-width matches
			if (m.index === this.regex.lastIndex) {
				this.regex.lastIndex++;
			}

			//console.log(m)
			const moduleName = m[1]
			const destFile = path.format({
				dir: this.baseDir,
				name: moduleName,
				ext: '.wren'
			})
			const baseDir = path.dirname(destFile)
			const sourceFile = path.join(this.baseDir, this.input)

			if (!reservedModules.includes(moduleName)) {
				modules.push({
					// code: m[0],
					name: moduleName,
					index: m['index'],
					//inputCode: m['input'],
					sourceFile: sourceFile,
					destFile: destFile,
					baseDir: baseDir
				})

				replaceCode.push(m[0])
			}
		}

		// Replace all found module imports.
		this.code = this.code.toString()
		for (let codeToReplace of replaceCode) {
			this.code = this.code.replace(codeToReplace, '// ' + codeToReplace)
		}

		// Clean the array
		modules = modules.filter(n => n)

		return modules
	}

	allModules() {
		const mods = this.modules()
		let allModules = []

		// Append all child modules.
		for (let mod of mods) {
			const wren = new Wrenpack(mod.destFile)
			const childModules = wren.allModules()
			if (childModules) {
				allModules = allModules.concat(childModules)
			}
			allModules.push(mod)
		}

		// Append the parent module.
		let code = this.code.toString().trim() + '\n'
		allModules.push({
			code: code,
			name: this.input,
			index: 0,
			//inputCode: this.code.toString(),
			sourceFile: this.input,
			destFile: '',
			baseDir: this.baseDir,
			md5: md5(code)
		})

		return allModules
	}

	pack () {
		const mods = this.allModules()

		// Retrieve all code
		const codes = []
		for (let mod of mods) {
			if (mod.md5) {
				codes.push({
					md5: mod.md5,
					code: mod.code,
					name: path.resolve(path.join(mod.baseDir, mod.name))
				})
			}
		}

		// Concatenate them only once
		let concat = ''
		const addedCodes = []
		for (let code of codes) {
			if (!addedCodes.includes(code.md5)) {
				addedCodes.push(code.md5)
				concat += `// ${code.name}\n${code.code}`
			}
		}

		return concat
	}

}

module.exports = Wrenpack
