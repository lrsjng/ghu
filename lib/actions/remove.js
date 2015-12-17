const chalk = require('chalk');
const {deletePath, shortPath} = require('../util');
const paths = require('../actions/paths');

module.exports = (sequence, options) => {
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
