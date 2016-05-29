const {test, assert} = require('scar');
const {jszip} = require('../../../lib/ghu');

test('lib.jszip is function', () => {
    assert.equal(typeof jszip, 'function');
});

test('lib.jszip() returns function', () => {
    assert.equal(typeof jszip(), 'function');
});

test('lib.jszip - no file', () => {
    const fn = jszip();
    const objs = [];

    return fn(objs).then(val => {
        assert.equal(val.length, 1);
        assert.equal(val[0].source, '@jszip');
        assert.equal(Buffer.isBuffer(val[0].content), true);
    });
});

test('lib.jszip - two files', () => {
    const fn = jszip();
    const objs = [{source: 'a.txt', content: 'a'}, {source: 'b.txt', content: 'b'}];

    return fn(objs).then(val => {
        assert.equal(val.length, 1);
        assert.equal(val[0].source, '@jszip');
        assert.equal(Buffer.isBuffer(val[0].content), true);
    });
});
