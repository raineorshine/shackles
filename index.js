'use strict'

function id (x) { return x }
function second (x,y) { return y }

function shackles(host) {

	host = host || {}

	// a mutating value which the host function wrappers will have closure over
	var value

	// the chaining object that houses all the wrapped functions
	var container = {
		value: function() {
			return value
		},
		toString: function() {
			return value.toString()
		},
		spy: function(f) {
			(f || container.logger.log)(value)
			return container
		},
		logger: console
	}

	// a wrapper function that invokes the host function with the mutator value as the first argument
	// attaches to the container for chaining
	// must be part of a separate create method so that f is retained (it gets lost in the for loop iteration otherwise)
	function createMutator(f) {
		return function() {
			var args = Array.prototype.concat.apply([value], [Array.prototype.slice.call(arguments)])
			value = f.apply(host, args)
			// console.log('arguments', arguments, 'args', args, 'value', value)
			return container
		}
	}

	// move each property from the host onto the container
	for(var key in host) {

		// protect the value property
		if(key === 'value') {
			console.warn('value is reserved for getting the result of the chain. The host object has value property which will be ignored.')
			continue
		}

		// if the property value is not a function, wrap it in the identity function
		var f = typeof host[key] === 'function' ?
			host[key] :
			id.bind(null, host[key])

		container[key] = createMutator(f)
	}

	// return a function that can start the chain while setting an initial value
	return createMutator(second)
}

module.exports = shackles
