const fs = require('fs')
const path = require('path')
const md5 = require('md5')
const stripComments = require('strip-comments')
const removeBlankLines = require('remove-blank-lines')
const trimLines = require('trim-lines')
const luamin = require('luamin')

const reservedModules = [
	'random',
	'core',
	'io',
	'os',
	'ffi',
	'http',
	'socket',
	'osstream',
	'meta',
	'scheduler',
	'timer'
]

class ScriptPacker {

	constructor(input = 'index.wren', dir = '', language = '') {
		this.baseDir = dir ? dir : path.dirname(input)
		this.input = path.basename(input)
		if (!language) {
			if (input.includes('.wren')) {
				language = 'wren'
			} else if (input.includes('.nut')) {
				language = 'squirrel'
			} else if (input.includes('.chai')) {
				language = 'chaiscript'
			} else if (input.includes('.lua')) {
				language = 'lua'
			}
		}
		this.language = language
		switch (this.language) {
			case 'wren':
				this.extension = 'wren'
				this.regex = /import \"([a-zA-Z0-9\.\/]*)\".*\n/g
				break
			case 'squirrel':
				this.extension = 'nut'
				this.regex = /import\(\"([a-zA-Z0-9\.\/]*)\"\).*\n/g
				break
			case 'chaiscript':
				this.extension = 'chai'
				this.regex = /require\(\"([a-zA-Z0-9\.\/]*)\"\).*\n/g
				break
			case 'lua':
				this.extension = 'lua'
				this.regex = /require ?\(?\"([a-zA-Z0-9\.\/]*)\".*\n/g
		}
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

			const moduleName = m[1]
			const destFile = path.format({
				dir: this.baseDir,
				name: moduleName,
				ext: '.' + this.extension
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
		let commentBeginning = '// '
		if (this.language == 'lua') {
			commentBeginning = '-- '
		}
		for (let codeToReplace of replaceCode) {
			this.code = this.code.replace(codeToReplace, commentBeginning + codeToReplace)
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
			const wren = new ScriptPacker(mod.destFile, '', this.language)
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

	pack (minify = false, prefix = '') {
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
				switch (this.language) {
					case 'lua':
						concat += `-- ${code.name}\n${code.code}`
					break
					default:
						concat += `// ${code.name}\n${code.code}`
					break
				}
			}
		}

		if (minify) {
			concat = this.minifyCode(concat)
		}

		if (prefix) {
			return prefix.replace(/\\n/g, '\n') + "\n" + concat
		}

		return concat
	}

	minifyCode(code) {
		// Strip the comments.
		let stripCommentsOptions = {}
		if (this.language == 'lua') {
			stripCommentsOptions.language = 'lua'
		}
		let out = stripComments(code, stripCommentsOptions)

		// Remove any empty lines and trim whitespace
		out = removeBlankLines(out)
		out = trimLines(out)

		// If we're on Lua, we can minify further.
		if (this.language == 'lua') {
			out = luamin.minify(out)
		}

		return out
	}
}

module.exports = ScriptPacker
