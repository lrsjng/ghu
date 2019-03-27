const {test, assert} = require('scar');
const {jszip} = require('../../../lib/ghu');

test('lib.jszip()', () => {
    assert.equal(typeof jszip, 'function');
    assert.equal(typeof jszip(), 'function');
});

test('lib.jszip() - no file', () => {
    const fn = jszip();
    const objs = [];

    return fn(objs).then(val => {
        assert.equal(val.length, 1);
        assert.equal(val[0].source, '@jszip');
        assert.equal(Buffer.isBuffer(val[0].content), true);
    });
});

test('lib.jszip() - two files', () => {
    const fn = jszip();
    const objs = [{source: 'a.txt', content: 'a'}, {source: 'b.txt', content: 'b'}];

    return fn(objs).then(val => {
        assert.equal(val.length, 1);
        assert.equal(val[0].source, '@jszip');
        assert.equal(Buffer.isBuffer(val[0].content), true);
    });
});

test('lib.jszip() - compression', () => {
    const objs = [{source: 'a.txt', content: 'aaaaaaaaaaaaaaaaaaaa'}];

    return Promise.all([
        jszip()(objs).then(val => val[0].content.length),
        jszip({level: 0})(objs).then(val => val[0].content.length),
        jszip({level: 9})(objs).then(val => val[0].content.length)
    ]).then(([len, len0, len9]) => {
        console.log(len, len0, len9);
        assert.ok(len === len0);
        assert.ok(len > len9);
    });
});
