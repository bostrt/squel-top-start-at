var squel = require('squel');
var assert = require('assert');
var selectTop = require('./index').selectTop;

describe('select', function() {
	it('should return "SELECT * FROM test"', function() {
		var query = selectTop().from('test').toString();
		assert.equal('SELECT * FROM test', query);
	});
	describe('#first', function() {
		it('should return "SELECT FIRST * FROM test"', function() {
			var query = selectTop().first().from('test').toString();
			assert.equal('SELECT FIRST * FROM test', query);
		});
	});
	describe('#top', function() {
		it('should return "SELECT TOP 2 * FROM test"', function() {
			var query = squel.selectTop().top(2).from('test').toString();
			assert.equal('SELECT TOP 2 * FROM test', query);
		});
		it('should return "SELECT TOP ALL * FROM test"', function() {
			var query = squel.selectTop().top('ALL').from('test').toString();
			assert.equal('SELECT TOP ALL * FROM test', query);
		});
		describe('#start at', function() {
			it('should return "SELECT TOP 10 START AT 1 * FROM test"', function() {
				var query = squel.selectTop().top(10).startAt(1).from('test').toString();
				assert.equal('SELECT TOP 10 START AT 1 * FROM test', query);
			});
		});
	});
});