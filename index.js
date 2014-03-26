var squel = require('squel');

Function.prototype.inheritsFrom = function(parentClass) {
	this.prototype = new parentClass;
	this.prototype.constructor = this;
	this.prototype.parent = parentClass.prototype;
};

var TopStartAtBlock = function() {};
TopStartAtBlock.inheritsFrom(squel.cls.Block);

TopStartAtBlock.prototype.first = function() {
	// top+start at and first are mutually exclusive.
	this._first = true;
	this._top = null;
	this._start = null;
};

TopStartAtBlock.prototype.top = function(top) {
	// TODO: Sanitize....ALL or simple expressions.
	// top+start at and first are mutually exclusive.
	this._top = top;
	this._first = false;
};

TopStartAtBlock.prototype.startAt = function(start) {
	// top+start at and first are mutually exclusive.	
	this._start = start;
	this._first = false;
};

TopStartAtBlock.prototype.buildStr = function() {
	if (this._first) {
		return 'FIRST';
	}

	if (this._start && !this._top) {
		// Cannot have START AT without a TOP
		throw new Error('Must call top() along with startAt()');
	}

	var str = '';
	if (this._top) {
		str = 'TOP ' + this._top;
	}

	if (this._start) {
		str += ' START AT ' + this._start;
	}
	return str;
}

exports.selectTop = squel.selectTop = function(options) {
	var allowNestedOptions = options || {};
	allowNestedOptions['allowNested'] = true;

	return squel.select(options, [
        new squel.cls.StringBlock(options, 'SELECT'),
        new TopStartAtBlock(options),
        new squel.cls.DistinctBlock(options),
        new squel.cls.GetFieldBlock(options),
        new squel.cls.FromTableBlock(allowNestedOptions),
        new squel.cls.JoinBlock(allowNestedOptions),
        new squel.cls.WhereBlock(options),
        new squel.cls.GroupByBlock(options),
        new squel.cls.OrderByBlock(options),
        new squel.cls.LimitBlock(options),
        new squel.cls.OffsetBlock(options)
        ]);
};
