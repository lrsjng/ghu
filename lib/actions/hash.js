import crypto from 'crypto';
import each from './each';

const hash = (sequence, options) => {
    const settings = Object.assign({
        algorithm: 'sha1',  // 'sha1', 'md5', 'sha256', 'sha512'
        encoding: 'hex'     // 'hex', 'base64'
    }, options);

    const shasum = crypto.createHash(settings.algorithm);
    shasum.update(sequence);
    return shasum.digest(settings.encoding);
};

export default function action(options) {
    return each(obj => {
        obj.hash = hash(obj.content, options);
    }, {filter: obj => obj && obj.content});
}

action.string = hash;
