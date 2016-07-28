const {test, assert} = require('scar');
const {uglify} = require('../../../lib/ghu');

test('lib.uglify()', () => {
    assert.equal(typeof uglify, 'function');
    assert.equal(typeof uglify(), 'function');
});

test('lib.uglify() - no objects', () => {
    const fn = uglify();
    const objs = [];

    return fn(objs).then(val => {
        assert.deepEqual(val, []);
    });
});

test('lib.uglify() - empty', () => {
    const fn = uglify();
    const content = '';
    const expected = '';
    const objs = [{source: 'a.js', content}];

    return fn(objs).then(val => {
        assert.deepEqual(val, [{source: 'a.js', content: expected}]);
    });
});

test('lib.uglify() - compact', () => {
    const fn = uglify();
    const content = 'var abcd = 1';
    const expected = 'var abcd=1;';
    const objs = [{source: 'a.js', content}];

    return fn(objs).then(val => {
        assert.deepEqual(val, [{source: 'a.js', content: expected}]);
    });
});

test('lib.uglify() - compress', () => {
    const fn = uglify({compressor: {warnings: false}});
    const content = 'function fn() {\n  var abcd = 1;\n};\n;\n';
    const expected = 'function fn(){}';
    const objs = [{source: 'a.js', content}];

    return fn(objs).then(val => {
        assert.deepEqual(val, [{source: 'a.js', content: expected}]);
    });
});
