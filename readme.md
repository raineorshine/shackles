# shackles
[![Build Status](https://travis-ci.org/metaraine/shackles.svg?branch=master)](https://travis-ci.org/metaraine/shackles)
[![NPM version](https://badge.fury.io/js/shackles.svg)](http://badge.fury.io/js/shackles)

> A minimal chaining library with spying


## Install

```sh
$ npm install --save shackles
```


## Basic Usage

Add chaining to a library:

	var stringlib = {
		prepend: function(str, chr) {
			return chr + str
		},
		append: function(str, chr) {
			return str + chr
		}
	}

	var chain = shackles(stringlib)

	var result = chain('Hello')
		.prepend('(')
		.append('!')
		.append(')')
		.value() // (Hello!)

If underscore didn't have chaining, we could easily add it:

	var chain = shackles(_)

	var result = chain([1,2,3])
		.map(function (x) { return x*x })
		.filter(function (x) { return x > 2 })
		.value() // [4,9]

Scalar properties become chainable methods that override the underlying value:

	var chain = shackles({
		inc: function(x) { return x+1 }
		pi: 3.141592654
	})

	var result = chain(0)
		.inc()
		.inc()
		.num()
		.inc()
		.value() // 4.141592654

## Spying

You can transform the value at any point in the chain:

	var chain = shackles(/*lib*/)

	var result = chain(10)
		.spy(function(value) {
			return value * 2;
		})
		.value() // 20

The default spying method is `console.log`:

	var chain = shackles({
		inc: function(x) { return x+1 }
	})

	var result = chain(0)
		.inc()
		.spy() // 1
		.inc()
		.spy() // 2
		.inc()
		.inc()
		.value() // 4


You can override the default spying method with any log function:

	var spied = null

	var chain = shackles({}, {
		logger: {
			log: function(value) {
				spied = value * 2
			}
		}
	})

	var result = chain(10)
		.spy()
		.value() // 10

	console.log(spied) // 20

You can enable/disable spying for longer sections of the chain:

	var history = []

	var stringlib = {
		prepend: function(str, chr) {
			return chr + str
		},
		append: function(str, chr) {
			return str + chr
		}
	}

	var chain = shackles(stringlib, {
		logger: {
			log: function(value) {
				history.push(value)
			}
		}
	})

	var result = chain('Hello')
		.spy(true)
		.prepend('(')
		.append('!')
		.append(')')
		.spy(false)
		.append('?')
		.append('?')
		.append('?')
		.value() // (Hello!)???

	console.log(history) 
	/* [
		'Hello',
		'(Hello',
		'(Hello!',
		'(Hello!)'
	]) */
```


## License

ISC © [Raine Lourie](https://github.com/metaraine)
