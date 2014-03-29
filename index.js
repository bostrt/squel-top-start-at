var squel = require('squel');

Function.prototype.inheritsFrom = function(parentClass) {
	this.prototype = new parentClass;
	this.prototype.constructor = this;
	this.prototype.parent = parentClass.prototype;
};

var TopStartAtBlock = function() {};
TopStartAtBlock.inheritsFrom(squel.cls.Block);

/**
 * Sanitizes TOP parameter. Must be numeric (>0) or "ALL".
 */
TopStartAtBlock.prototype._sanitizeTop = function(top) {
	var parsed = parseInt(top);
	if (isNaN(parsed)) {
		if (top && typeof top === 'string' && top.toLowerCase() == 'all') {
			return 'ALL';
		} else {
			throw new Error('Invalid argument for top()');
		}
	}

	if (parsed > 0) {
		return top;
	} else {
		throw new Error('Invalid argument for top()');
	}
};

/**
 * Sanitizes START AT parameter. Must be numeric (>0).
 */
TopStartAtBlock.prototype._sanitizeStartAt = function(start) {
	var parsed = parseInt(start);
	if (isNaN(parsed)) {
		throw new Error('Invalid argument for startAt()');
	}

	if (parsed > 0) {
		return start;
	} else {
		throw new Error('Invalid argument for startAt()');
	}
};

/**
 * Adds FIRST keyword to query. Throws Error if either top() 
 * or startAt() have been called as FIRST and TOP [START AT] are
 * mutualy exclusive keywords.
 */
TopStartAtBlock.prototype.first = function() {
	// top+start at and first are mutually exclusive.
	if  (this._top || this._start) {
		throw new Error('Cannot call first() with top()/startAt()');
	}
	this._first = true;
};

/**
 * Adds TOP keyword to query. Throws Error if first()
 * has been called. FIRST and TOP are mutually exclusive 
 * keywords.
 */
TopStartAtBlock.prototype.top = function(top) {
	if (this._first) {
		throw new Error('Cannot call first() with top()/startAt()');
	}
	this._top = this._sanitizeTop(top);
};

/**
 * Adds START AT keyword to query. Throws Error if first()
 * has been called. FIRST and TOP START AT are mutually exclusive
 * keywords.
 */
TopStartAtBlock.prototype.startAt = function(start) {
	if (this._first) {
		throw new Error('Cannot call first() with top()/startAt()');
	}
	this._start = this._sanitizeStartAt(start);
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

squel.cls.TopStartAtBlock = TopStartAtBlock;

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
