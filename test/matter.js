'use strict';

/* deps: mocha */
require('should');
var fs = require('fs');
var matter = require('..');


describe('Read from strings:', function () {
  it('should extract YAML front matter', function () {
    var actual = matter('---\nabc: xyz\n---');
    actual.should.have.property('data');
    actual.should.have.property('content');
    actual.should.have.property('orig');
    actual.data.should.have.property('abc');
    actual.data.abc.should.equal('xyz');
  });

  it('should throw an error when front-matter cannot be parsed:', function () {
    (function() {
      matter('---whatever\nabc: xyz\n---')
    }).should.throw('gray-matter cannot find a parser for: ---whatever\nabc: xyz\n---');
  });

  it('should throw an error when a string is not passed:', function () {
    (function() {
      matter()
    }).should.throw('gray-matter expects a string');
  });

  it('should return an object when the string is 0 length:', function () {
    matter('').should.eql({orig: '', data: {}, content: ''});
  });

  it('should extract YAML front matter and content', function () {
    var fixture = '---\nabc: xyz\nversion: 2\n---\n\n<span class="alert alert-info">This is an alert</span>\n';
    var actual = matter(fixture);
    actual.should.have.property('data', {abc: 'xyz', version: 2});
    actual.should.have.property('content', '\n<span class="alert alert-info">This is an alert</span>\n');
    actual.should.have.property('orig');
  });

  it('should use a custom delimiter as a string.', function () {
    var fixture = '~~~\nabc: xyz\nversion: 2\n~~~\n\n<span class="alert alert-info">This is an alert</span>\n';
    var actual = matter(fixture, {delims: '~~~'});
    actual.should.have.property('data', {abc: 'xyz', version: 2});
    actual.should.have.property('content', '\n<span class="alert alert-info">This is an alert</span>\n');
    actual.should.have.property('orig');
  });

  it('should use custom delimiters as an array.', function () {
    var fixture = '~~~\nabc: xyz\nversion: 2\n~~~\n\n<span class="alert alert-info">This is an alert</span>\n';
    var actual = matter(fixture, {delims: ['~~~']});
    actual.should.have.property('data', {abc: 'xyz', version: 2});
    actual.should.have.property('content', '\n<span class="alert alert-info">This is an alert</span>\n');
    actual.should.have.property('orig');
  });

  it('should correctly identify delimiters and ignore strings that look like delimiters.', function () {
    var fixture = '---\nname: "troublesome --- value"\n---\nhere is some content\n';
    var actual = matter(fixture);
    actual.should.have.property('data', {name: 'troublesome --- value'});
    actual.should.have.property('content', 'here is some content\n');
    actual.should.have.property('orig', '---\nname: "troublesome --- value"\n---\nhere is some content\n');
  });

  it('should correctly parse a string that only has an opening delimiter.', function () {
    var fixture = '---\nname: "troublesome --- value"\n';
    var actual = matter(fixture);
    actual.should.have.property('data', {name: 'troublesome --- value'});
    actual.should.have.property('content', '');
    actual.should.have.property('orig', '---\nname: "troublesome --- value"\n');
  });

  it('should not try to parse a string has content that looks like front-matter.', function () {
    var fixture = '-----------name--------------value\nfoo';
    var actual = matter(fixture);
    actual.should.have.property('data', {});
    actual.should.have.property('content', '-----------name--------------value\nfoo');
    actual.should.have.property('orig', '-----------name--------------value\nfoo');
  });
});
