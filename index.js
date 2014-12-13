'use strict'

function id (x) { return x }
function second (x,y) { return y }

var deadLogger = {
	log: function() {
		throw new Error('Cannot log because console is not defined and no logger was provided.')
	}
}

function shackles(host, options) {

	host = host || {}
	options = options || {}
	var logger = options.logger || (typeof console !== undefined ? console : deadLogger)

	// a mutating value which the host function wrappers will have closure over
	var value

	// when enabled, all chained functions will invoke the logger
	var logAll = false

	// the chaining object that houses all the wrapped functions
	var container = {
		value: function() {
			return value
		},
		toString: function() {
			return value.toString()
		},
		tap: function(f) {
		  var result = f(value)
		  if(result !== undefined) {
		  	value = result
		  }
		  return container
		},
		log: function(enable) {

			// if a flag was passed, toggle logging on all chain methods
			if(enable !== undefined) {
				logAll = enable
			}

			if(enable !== false || logAll) {
				logger.log(value)
			}

			return container
		}
	}

	// a wrapper function that invokes the given function with the mutator value as the first argument
	// attaches to the container for chaining
	// must be part of a separate create method so that f is retained (it gets lost in the for loop iteration otherwise)
	function createMutator(f) {
		return function() {
			var args = Array.prototype.concat.apply([value], [Array.prototype.slice.call(arguments)])
			value = f.apply(null, args)
			if(logAll) {
				container.log()
			}
			// console.log('arguments', arguments, 'args', args, 'value', value)
			return container
		}
	}

	// helper method to add a value at the specified key to the container
	function addToContainer(key, value) {

		var f = typeof value === 'function' ?
			value :
			id.bind(null, value)

		container[key] = createMutator(f)
	}

	// copy each property from the host to the container as a chainable function with the same name
	function addAllPropertiesToContainer() {

		for(var key in host) {

			// protect the value property
			if(key in container) {
				console.warn(key + ' is reserved. The host object\'s property will be ignored.')
				continue
			}

			addToContainer(key, host[key])
		}
	}

	// initialize
	addAllPropertiesToContainer()

	// return a function that can set an initial value and start the chain
	return createMutator(second)
}

module.exports = shackles
