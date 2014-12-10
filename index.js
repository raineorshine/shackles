'use strict'

function id (x) { return x }
function second (x,y) { return y }

function shackles(host, options) {

	host = host || {}
	options = options || {}
	var logger = options.logger || console

	// a mutating value which the host function wrappers will have closure over
	var value

	// when enabled, all chained functions will invoke the logger
	var spyAll = false

	// the chaining object that houses all the wrapped functions
	var container = {
		value: function() {
			return value
		},
		toString: function() {
			return value.toString()
		},
		spy: function(x) {

			// as long as we're not just disabling spyAll, log the current value either with a given spy function or the default logger
			if(x !== false) {
				var log = typeof x === 'function' ? x : logger.log
				var spyResult = log(value)
			}

			// if the spy function returned a value, override the boxed value
			if(spyResult !== undefined) {
				value = spyResult
			}

			// if a boolean was given, toggle spyAll
			if(typeof x === 'boolean') {
				spyAll = x
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
			if(spyAll) {
				container.spy()
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
