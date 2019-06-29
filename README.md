# Wrenpack

Package multiple [Wren](http://wren.io) files into one, in JavaScript.

## Installation

```
npm i -g wrenpack
```

## Usage

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