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

	it('should default to empty object if no host object is provided', function () {
		var C = shackles()
		var result = C('test').value()
		assert.equal(result, 'test')
	})

	it('should have a toString method that returns the string represention of the boxed value', function () {
		var C = shackles()
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

	it('should override the boxed value with any scalar properties that are called as chained functions', function () {

		var C = shackles({
			num: 10
		})

		var result = C('dummy')
			.num()
			.value()

		assert.equal(result, 10)
	})

	it('should have a chainable spy function that passes the value to a function', function () {

		var C = shackles()

		var spied = null

		var result = C(10)
			.spy(function(value) {
				spied = value * 2
			})
			.value()

		assert.equal(result, 10)
		assert.equal(spied, 20)
	})

	it('should override the boxed value with the value that the spy callback returns', function () {

		var C = shackles()

		var spied = null

		var result = C(10)
			.spy(function(value) {
				return value/2
			})
			.value()

		assert.equal(result, 5)
	})

	it('should have a chainable spy function that uses an overrideable logger', function () {

		var spied = null

		var C = shackles({}, {
			logger: {
				log: function(value) {
					spied = value * 2
				}
			}
		})

		var result = C(10)
			.spy()
			.value()

		assert.equal(result, 10)
		assert.equal(spied, 20)
	})

	it('should enable/disable spying on all chained functions', function () {

		var history = []

		var stringlib = {
			prepend: function(str, chr, chr2) {
				return (chr || '') + (chr2 || '') + str
			},
			append: function(str, chr, chr2) {
				return str + (chr || '') + (chr2 || '')
			}
		}

		var C = shackles(stringlib, {
			logger: {
				log: function(value) {
					history.push(value)
				}
			}
		})

		var result = C('Hello')
			.spy(true)
			.prepend('(')
			.append('!', '?')
			.spy(false)
			.append(')')
			.value()

		assert.deepEqual(history, [
			'Hello',
			'(Hello',
			'(Hello!?',
		])

		assert.equal(result, '(Hello!?)')
	})

})
