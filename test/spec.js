'use strict'

var assert = require('insist')
var shackles = require('../index.js')
var _ = require('lodash')

describe('shackles', function() {

	it('should be able to set an initial value and retrieve it with .value()', function () {
		var chain = shackles({})
		var result = chain('test').value()
		assert.equal(result, 'test')
	})

	it('should default to empty object if no host object is provided', function () {
		var chain = shackles()
		var result = chain('test').value()
		assert.equal(result, 'test')
	})

	it('should have a toString method that returns the string represention of the boxed value', function () {
		var chain = shackles()
		var result = chain('test').toString()
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

		var chain = shackles(stringlib)

		var result = chain('Hello')
			.prepend('(')
			.append('!', '?')
			.append(')')
			.value()

		assert.equal(result, '(Hello!?)')
	})

	it('should chain lodash', function () {

		var chain = shackles(_)

		var result = chain([1,2,3])
			.map(function (x) { return x*x })
			.filter(function (x) { return x > 2 })
			.value()

		assert.deepEqual(result, [4, 9])
	})

	it('should override the boxed value with any scalar properties that are called as chained functions', function () {

		var chain = shackles({
			num: 10
		})

		var result = chain('dummy')
			.num()
			.value()

		assert.equal(result, 10)
	})

	describe('tap', function() {

		it('should have a chainable tap function that passes the value to a function', function () {

			var chain = shackles()

			var myval = null

			var result = chain(10)
				.tap(function(value) {
					myval = value * 2
				})
				.value()

			assert.equal(result, 10)
			assert.equal(myval, 20)
		})

		it('should override the boxed value with the value that the tap callback returns', function () {

			var chain = shackles()

			var result = chain(10)
				.tap(function(value) {
					return value/2
				})
				.value()

			assert.equal(result, 5)
		})
	})

	describe('log', function() {

		it('should have a chainable log function that uses an overrideable logger', function () {

			var doubled = null

			var chain = shackles({}, {
				logger: {
					log: function(value) {
						doubled = value * 2
					}
				}
			})

			var result = chain(10)
				.log()
				.value()

			assert.equal(result, 10)
			assert.equal(doubled, 20)
		})

		it('should enable/disable logging on all chained functions', function () {

			var history = []

			var stringlib = {
				prepend: function(str, chr, chr2) {
					return (chr || '') + (chr2 || '') + str
				},
				append: function(str, chr, chr2) {
					return str + (chr || '') + (chr2 || '')
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
				.log(true)
				.prepend('(')
				.append('!', '?')
				.log(false)
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

})
