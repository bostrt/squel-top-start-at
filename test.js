var squel = require('squel');
var assert = require('assert');
var selectTop = require('./index').selectTop;

describe('TopStartAtBlock', function() {
	describe('#_sanitizeTop', function() {
		var block = new squel.cls.TopStartAtBlock();
		it('should parse numerics', function() {
			assert.equal(10, block._sanitizeTop('10'));
			assert.equal(1, block._sanitizeTop('1'));
			assert.equal(42, block._sanitizeTop('42'));
		});
		it('should return "ALL"', function() {
			assert.equal('ALL', block._sanitizeTop('all'));
			assert.equal('ALL', block._sanitizeTop('ALL'));
			assert.equal('ALL', block._sanitizeTop('ALl'));
		});
		it('should throw error', function() {
			var sanitize = block._sanitizeTop;

			assert.throws(sanitize.bind(block, null), Error);
			assert.throws(sanitize.bind(block, 'foobar'), Error);
			assert.doesNotThrow(sanitize.bind(block, 3));
			assert.throws(sanitize.bind(block, -1), Error);
		});
	});

	describe('#_sanitizeStartAt', function() {
		var block = new squel.cls.TopStartAtBlock();
		it('should parse numerics', function() {
			assert.equal(10, block._sanitizeStartAt('10'));
			assert.equal(1, block._sanitizeStartAt('1'));
			assert.equal(42, block._sanitizeStartAt('42'));
		});
		it('should throw error', function() {
			var sanitize = block._sanitizeStartAt;

			assert.throws(sanitize.bind(block, null), Error);
			assert.throws(sanitize.bind(block, 'bizbang'), Error);
			assert.doesNotThrow(sanitize.bind(block, 3), Error);
			assert.throws(sanitize.bind(block, -1), Error);
		});
	});
});

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
		it('should throw an error becaue of combination of TOP/START AT with FIRST', function() {
			var func1 = selectTop().top(10).first;
			var func2 = selectTop().top(10).startAt(2).first;
			assert.throws(func1, Error);
			assert.throws(func2, Error);
		});
	});
	describe('#top', function() {
		it('should return "SELECT TOP 2 * FROM test"', function() {
			var query = squel.selectTop().top('2').from('test').toString();
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
			it('should throw Error because of missing TOP', function() {
				var func = selectTop().startAt(3).toString;
				assert.throws(func, Error);
			});
		});
	});
});