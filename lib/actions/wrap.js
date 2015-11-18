import each from './each';

export default function wrap(prepend = '', append = '') {
    return each(obj => {
        obj.content = String(prepend) + obj.content + String(append);
    });
}
