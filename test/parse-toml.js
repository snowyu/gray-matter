/*!
 * gray-matter <https://github.com/jonschlinkert/gray-matter.git>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var fs = require('fs');
require('should');
var matter = require('..');

describe('parse TOML:', function () {
  it('should parse toml front matter.', function () {
    var actual = matter('---\ntitle = "TOML"\ndescription = "Front matter"\ncategories = "front matter toml"\n---\n\n# This file has toml front matter!\n', {
      lang: 'toml'
    });
    actual.data.title.should.equal('TOML');
    actual.should.have.property('data');
    actual.should.have.property('content');
    actual.should.have.property('orig');
  });

  it('should auto-detect TOML as the language.', function () {
    var actual = matter('---toml\ntitle = "autodetect-TOML"\n[props]\nuser = "jonschlinkert"\n---\nContent\n');
    actual.data.title.should.equal('autodetect-TOML');
    actual.should.have.property('data');
    actual.should.have.property('content');
    actual.should.have.property('orig');
  });

  it('should NOT throw on TOML syntax errors when `strict` is NOT defined.', function () {
    (function () {
      matter('---toml\n[props\nuser = "jonschlinkert"\n---\nContent\n');
    }).should.not.throw();
  });

  it.skip('should throw on TOML syntax errors when `strict` IS defined.', function () {
    (function () {
      matter('---toml\n[props\nuser = "jonschlinkert"\n---\nContent\n', {strict: true});
    }).should.throw('gray-matter parser [TOML]: SyntaxError: Expected "]" but "\n" found.');
  });
});