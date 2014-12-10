'use strict'

var assert = require('insist')
var shackles = require('../index.js')
var _ = require('lodash')

describe('shackles', function() {

	it('should be able to set an initial value and retrieve it with .value()', function () {
		var C = shackles({})
		var result = C('test').value()
		assert.equal(result, 'test')
	})

	it('should have a toString method that returns the string represention of the boxed value', function () {
		var C = shackles({})
		var result = C('test').toString()
		assert.equal(result, 'test')
	})

	it('should chain a string library', function () {
		var stringlib = {
			prepend: function(str, chr, chr2) {
				return (chr || '') + (chr2 || '') + str
			},
			append: function(str, chr, chr2) {
				return str + (chr || '') + (chr2 || '')
			}
		}

		var C = shackles(stringlib)

		var result = C('Hello')
			.prepend('(')
			.append('!', '?')
			.append(')')
			.value()

		assert.equal(result, '(Hello!?)')
	})

	it('should chain lodash', function () {

		var C = shackles(_)

		var result = C([1,2,3])
			.map(function (x) { return x*x })
			.filter(function (x) { return x > 2 })
			.value()

		assert.deepEqual(result, [4, 9])
	})

	it('should handle scalar properties', function () {

		var C = shackles({
			num: 10
		})

		var result = C('dummy')
			.num()
			.value()

		assert.deepEqual(result, 10)
	})

})
