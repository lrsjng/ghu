const crypto = require('crypto');
const each = require('./each');

const hash = (sequence, options) => {
    const settings = Object.assign({
        algorithm: 'sha1', // 'sha1', 'md5', 'sha256', 'sha512'
        encoding: 'hex' // 'hex', 'base64'
    }, options);

    const shasum = crypto.createHash(settings.algorithm);
    shasum.update(sequence);
    return shasum.digest(settings.encoding);
};

const action = options => {
    return each(obj => {
        obj.hash = hash(obj.content, options);
    }, {filter: obj => obj && (obj.content || obj.content === '')});
};

action.string = hash;
module.exports = action;
