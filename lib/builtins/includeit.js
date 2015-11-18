import includeit from 'includeit';
import each from '../actions/each';

export default function action(options) {
    const settings = Object.assign({
        encoding: 'utf-8'
    }, options);

    return each(obj => {
        obj.content = includeit({file: obj.source, content: obj.content, charset: settings.encoding});
    });
}
