const chalk = require('chalk');
const dateformat = require('dateformat');
const watch = require('watch');
const {shortPath} = require('../util');

const now = () => dateformat(Date.now(), 'HH:MM:ss');

module.exports = (paths, fn) => {
    let hits = 0;
    let isRunning = false;

    const check = () => {
        if (hits && !isRunning) {
            hits = 0;
            isRunning = true;
            Promise.resolve()
                .then(fn)
                .then(() => {
                    isRunning = false;
                    console.log(chalk.grey(`\n[${now()}] watching...\n`));
                    check();
                });
        }
    };

    const handler = () => {
        hits += 1;
        check();
    };

    const add = path => {
        watch.createMonitor(path, monitor => {
            monitor
                .on('created', handler)
                .on('changed', handler)
                .on('removed', handler);
        });
    };

    console.log(chalk.grey(`\n[${now()}] start watching ${paths.map(shortPath).join(', ')}...\n`));
    paths.forEach(add);
    return new Promise(() => null);
};
