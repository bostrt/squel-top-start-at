
squel-top-start-at [![Build Status](https://travis-ci.org/bostrt/squel-top-start-at.svg?branch=master)](https://travis-ci.org/bostrt/squel-top-start-at)
==================

[Squel.js](http://squeljs.org) plugin that adds support for the `TOP N`, `START AT N`, and `FIRST` keywords.

Install
========
`npm install squel-top-start-at` *PENDING*

Usage
======

```javascript
// Require squel before requring squel-top-start-at plugin.
var squel = require('squel');
var selectTop = require('squel-top-start-at').selectTop;

var query = selectTop.top(10).startAt(1).from('Item').toString;
// query => SELECT TOP 10 START AT 1 FROM Item

query = selectTop.top(25).from('Customer').toString();
// query => SELECT TOP 25 * FROM Customer

query = selectTop.first().from('Item').toString();
// query => SELECT FIRST * FROM Item
```

```javascript
// selectTop is also directly connected to squel
var squel = require('squel');
require('squel-top-start-at');

var query = squel.selectTop().top(10).startAt(100).from('PhoneNumber').toString();
// query => SELECT TOP 10 START AT 100 * FROM PhoneNumber
```

Tests
=====
```shell
npm install
npm test
```

License
=======
The MIT License (MIT)

Copyright (c) 2014 Robert Bost

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.