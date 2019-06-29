#!/usr/bin/env node

const fs = require('fs')
const Wrenpack = require('..')

require('yargs') // eslint-disable-line
	.command('build [input]', 'Build the given file', (yargs) => {
		return yargs
			.positional('input', {
				describe: 'The input file to build',
				default: 'index.wren'
			})
			.option('output', {
				alias: 'o',
				default: 'packed.wren',
				describe: 'Where to write the file',
				type: 'string'
			})
			.option('minify', {
				alias: 'm',
				default: false,
				describe: 'Minify the output',
				type: 'boolean'
			})
	}, (argv) => {
		const wren = new Wrenpack(argv.input)
		const out = wren.pack(argv.minify)
		fs.writeFileSync(argv.output, out)
	})
	.help()
	.argv