const {test, assert} = require('scar');
const {hash} = require('../../../lib/ghu');

test('lib.hash is function', () => {
    assert.equal(typeof hash, 'function');
});

test('lib.hash() returns function', () => {
    assert.equal(typeof hash(), 'function');
});

test('lib.hash - no objects', () => {
    const fn = hash();
    const objs = [];

    return fn(objs).then(val => {
        assert.deepEqual(val, []);
    });
});

test('lib.hash - empty', () => {
    const fn = hash();
    const content = '';
    const expected = 'da39a3ee5e6b4b0d3255bfef95601890afd80709';
    const objs = [{content}];

    return fn(objs).then(val => {
        assert.deepEqual(val, [{content, hash: expected}]);
    });
});

test('lib.hash - empty hex', () => {
    const fn = hash({
        encoding: 'hex'
    });
    const content = '';
    const expected = 'da39a3ee5e6b4b0d3255bfef95601890afd80709';
    const objs = [{content}];

    return fn(objs).then(val => {
        assert.deepEqual(val, [{content, hash: expected}]);
    });
});

test('lib.hash - empty base64', () => {
    const fn = hash({
        encoding: 'base64'
    });
    const content = '';
    const expected = '2jmj7l5rSw0yVb/vlWAYkK/YBwk=';
    const objs = [{content}];

    return fn(objs).then(val => {
        assert.deepEqual(val, [{content, hash: expected}]);
    });
});

test('lib.hash - empty md5 hex', () => {
    const fn = hash({
        algorithm: 'md5',
        encoding: 'hex'
    });
    const content = '';
    const expected = 'd41d8cd98f00b204e9800998ecf8427e';
    const objs = [{content}];

    return fn(objs).then(val => {
        assert.deepEqual(val, [{content, hash: expected}]);
    });
});

test('lib.hash - empty md5 base64', () => {
    const fn = hash({
        algorithm: 'md5',
        encoding: 'base64'
    });
    const content = '';
    const expected = '1B2M2Y8AsgTpgAmY7PhCfg==';
    const objs = [{content}];

    return fn(objs).then(val => {
        assert.deepEqual(val, [{content, hash: expected}]);
    });
});
