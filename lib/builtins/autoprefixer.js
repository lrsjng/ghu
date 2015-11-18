import autoprefixer from 'autoprefixer';
import each from '../actions/each';

export default function action(options) {
    const settings = Object.assign({
        browsers: ['last 2 versions']
    }, options);

    return each(obj => {
        obj.content = autoprefixer.process(obj.content, settings).css;
    });
}
