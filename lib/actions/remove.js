// const chalk = require('chalk');
const chalk = import('chalk');
const {delete_path, short_path} = require('../util');
const paths = require('../actions/paths');

module.exports = (sequence, options) => {
    const settings = Object.assign({
        silent: false
    }, options);

    return paths(sequence, settings)
        .then(allpaths => Promise.all(
            allpaths.map(path => delete_path(path)
                .then(() => {
                    if (!settings.silent) {
                        console.log(chalk.green('delete') + ' ' + short_path(path));
                    }
                })
            )
        ));
};
