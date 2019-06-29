# Wrenpack

Package multiple [Wren](http://wren.io) files into one, in JavaScript.

## Installation

```
npm i -g wrenpack
```

## Usage

```
wrenpack build [input]

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

1. Create a `Unicorn.wren` to import
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

2. Create your main `index.wren` file
	```
	import "Unicorn"
	var unicorn = Unicorn.new()
	unicorn.run()
	```

3. Run the build command
	``` bash
	wrenpack build index.wren --output=packed.wren
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