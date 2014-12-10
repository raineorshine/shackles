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
		.inc()
		.num()
		.value() // 3.141592654

## Spying

You can console.log the value at any point in the chain:

	var chain = shackles({
		inc: function(x) { return x+1 }
		pi: 3.141592654
	})

	var result = chain(10)
		.inc()
		.spy() // 1
		.inc()
		.spy() // 2
		.inc()
		.inc()
		.value() // 4


You can transform the value at any point in the chain:

	var chain = shackles(/*lib*/)

	var spied = null

	var result = chain(10)
		.spy(function(value) {
			return value * 2;
		})
		.value() // 20

You can override the default spy logger with any log function:

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
		.value() // 20

You can enable/disable spying for longer periods of time:

	var history = []

	var stringlib = {
		prepend: function(str, chr) {
			return chr + str
		},
		append: function(str, chr)
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

	assert.equal(result, '(Hello!?)')
})
```


## License

ISC © [Raine Lourie](https://github.com/metaraine)
