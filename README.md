# ScriptPacker

Package multiple [Wren](http://wren.io) or [Squirrel](http://squirrel-lang.org/) scripts together into one, using JavaScript.

Supports importing and bundling modules for the following languages:
- [Squirrel](http://squirrel-lang.org)
- [Wren](http://wren.io)
- ... Add more!

## Installation

```
npm i -g scriptpacker
```

## Usage

```
scriptpacker build [input]

Build the given file

Positionals:
  input  The input file to build                         [default: "index.wren"]

Options:
  --version     Show version number                                    [boolean]
  --help        Show help                                              [boolean]
  --output, -o  Where to write the file        [string] [default: "packed.wren"]
  --minify, -m  Minify the output                     [boolean] [default: false]
```

## Example

1. Create a `Unicorn.wren` or `Unicorn.nut` to import
	``` wren
	class Unicorn {
		construct new() {
			System.print("Greetings.")
		}
		run() {
			System.print("Running!")
		}
	}
	```

2. Use `import` to bundle the module
	```
	import "Unicorn"
	// In Squirrel, it would be: import("Unicorn")
	// Use the imported class.
	var unicorn = Unicorn.new()
	unicorn.run()
	```

3. Run the build command
	``` bash
	scriptpack build index.wren --output=packed.wren
	```

4. See the resulting `packed.wren`
	``` wren
	// Unicorn.wren
	class Unicorn {
		construct new() {
			System.print("Greetings.")
		}
		run() {
			System.print("Running!")
		}
	}
	// Game.wren
	// import "Unicorn"
	var unicorn = Unicorn.new()
	unicorn.run()
	```
