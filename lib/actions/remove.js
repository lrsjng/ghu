import chalk from 'chalk';
import {deletePath, shortPath} from '../util';
import paths from '../actions/paths';

export default (sequence, options) => {
    const settings = Object.assign({
        silent: false
    }, options);

    return paths(sequence, settings)
        .then(allpaths => Promise.all(
            allpaths.map(path => deletePath(path)
                .then(() => {
                    if (!settings.silent) {
                        console.log(chalk.green('delete') + ' ' + shortPath(path));
                    }
                })
            )
        ));
};
