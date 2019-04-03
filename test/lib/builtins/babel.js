const {test, assert} = require('scar');
const {babel} = require('../../../lib/ghu');
const CONF = {
    presets: ['@babel/preset-env']
};

test('lib.babel()', () => {
    assert.equal(typeof babel, 'function');
    assert.equal(typeof babel(), 'function');
});

test('lib.babel() - no objects', () => {
    const fn = babel();
    const objs = [];

    return fn(objs).then(val => {
        assert.deepEqual(val, []);
    });
});

test('lib.babel() - empty', () => {
    const fn = babel();
    const content = '';
    const expected = '';
    const objs = [{content}];

    return fn(objs).then(val => {
        assert.deepEqual(val, [{content: expected}]);
    });
});

test('lib.babel() - empty to es5', () => {
    const fn = babel(CONF);
    const content = '';
    const expected = '"use strict";';
    const objs = [{content}];

    return fn(objs).then(val => {
        assert.deepEqual(val, [{content: expected}]);
    });
});

test('lib.babel() - arrow to es5', () => {
    const fn = babel(CONF);
    const content = 'x => x*x';
    const expected = '"use strict";\n\n(function (x) {\n  return x * x;\n});';
    const objs = [{content}];

    return fn(objs).then(val => {
        assert.deepEqual(val, [{content: expected}]);
    });
});

test('lib.babel() - arrow-2 to es5', () => {
    const fn = babel(CONF);
    const content = '(x,y) => x*y';
    const expected = '"use strict";\n\n(function (x, y) {\n  return x * y;\n});';
    const objs = [{content}];

    return fn(objs).then(val => {
        assert.deepEqual(val, [{content: expected}]);
    });
});
