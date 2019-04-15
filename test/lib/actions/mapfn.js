const {test, assert} = require('scar');
const {mapfn} = require('../../../lib/ghu');

test('lib.mapfn', () => {
    assert.equal(typeof mapfn, 'function', 'is function');
    assert.equal(typeof mapfn.r, 'function');
    assert.equal(typeof mapfn.p, 'function');
    assert.equal(typeof mapfn.s, 'function');
    assert.equal(typeof mapfn.t, 'function');

    assert.equal(typeof mapfn.r('', '').r, 'function');
    assert.equal(typeof mapfn.r('', '').p, 'function');
    assert.equal(typeof mapfn.r('', '').s, 'function');
    assert.equal(typeof mapfn.r('', '').t, 'function');

    assert.equal(typeof mapfn.p('', '').r, 'function');
    assert.equal(typeof mapfn.p('', '').p, 'function');
    assert.equal(typeof mapfn.p('', '').s, 'function');
    assert.equal(typeof mapfn.p('', '').t, 'function');

    assert.equal(typeof mapfn.s('', '').r, 'function');
    assert.equal(typeof mapfn.s('', '').p, 'function');
    assert.equal(typeof mapfn.s('', '').s, 'function');
    assert.equal(typeof mapfn.s('', '').t, 'function');

    assert.equal(typeof mapfn.t('').r, 'function');
    assert.equal(typeof mapfn.t('').p, 'function');
    assert.equal(typeof mapfn.t('').s, 'function');
    assert.equal(typeof mapfn.t('').t, 'function');

    assert.equal(typeof mapfn.r('', '').p('', '').s('', '').t(''), 'function');
});

test('lib.mapfn.r()', () => {
    assert.equal(mapfn.r('a', 'b')('aaaa'), 'bbbb');
    assert.equal(mapfn.r('a', 'b')('caaa'), 'cbbb');
    assert.equal(mapfn.r('a', 'b')('caca'), 'cbcb');
    assert.equal(mapfn.r('aaa', 'b')('aaaa'), 'ba');
    assert.equal(mapfn.r('aaaa', 'b')('aaaa'), 'b');
    assert.equal(mapfn.r(/^.*\//, 'b/')('/a/a/a/c'), 'b/c');
    assert.equal(mapfn.r(/^.*\//, 'b/')('a/a/a/c'), 'b/c');
});

test('lib.mapfn.p()', () => {
    assert.equal(mapfn.p('a', 'b')('aaaa'), 'baaa');
    assert.equal(mapfn.p('a', 'b')('caaa'), 'caaa');
    assert.equal(mapfn.p('aaa', 'b')('aaaa'), 'ba');
    assert.equal(mapfn.p('aaaa', 'b')('aaaa'), 'b');
});

test('lib.mapfn.s()', () => {
    assert.equal(mapfn.s('a', 'b')('aaaa'), 'aaab');
    assert.equal(mapfn.s('a', 'b')('aaac'), 'aaac');
    assert.equal(mapfn.s('aaa', 'b')('aaaa'), 'ab');
    assert.equal(mapfn.s('aaaa', 'b')('aaaa'), 'b');
});

test('lib.mapfn.t()', () => {
    assert.equal(mapfn.t('b/')('/a/a/a/c'), 'b/c');
    assert.equal(mapfn.t('b/')('a/a/a/c'), 'b/c');
    assert.equal(mapfn.t('/b/')('/a/a/a/c'), '/b/c');
    assert.equal(mapfn.t('/b/')('a/a/a/c'), '/b/c');
    assert.equal(mapfn.t('b/')('/c'), 'b/c');
    assert.equal(mapfn.t('/b/')('c'), '/b/c');
});
