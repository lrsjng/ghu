import cssmin from 'cssmin';
import each from '../actions/each';

export default function action(options) {
    const settings = Object.assign({
        linebreak: -1
    }, options);

    return each(obj => {
        obj.content = cssmin(obj.content, settings.linebreak);
    });
}
