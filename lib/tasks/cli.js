const {Command} = require('commander');
const minimist = require('minimist');
// const chalk = require('chalk');
const chalk = import('chalk');
const {once} = require('../util');

const parse_cmdline_args = (argv = process.argv) => {
    const cli = new Command()
        .usage('[options] <task ...>')
        .option('-t, --show-tasks', 'show tasks')
        .option('-T, --list-tasks', 'list tasks')
        .option('-D, --list-defaults', 'list default tasks')
        .option('-n, --no-color', 'disable colored output')
        .parse(argv || []);
    const args = minimist(cli.args.map(arg => arg.replace(/^:/, '--')), {boolean: true});
    const sequence = args._;
    Reflect.deleteProperty(args, '_');

    return {
        showTasks: !!cli.showTasks,
        listTasks: !!cli.listTasks,
        listDefaults: !!cli.listDefaults,
        color: !!cli.color,
        sequence,
        args
    };
};

const cli = runner => {
    return Promise.resolve().then(() => {
        const options = parse_cmdline_args();

        if (!options.color) {
            chalk.enabled = false;
        }

        if (options.showTasks) {
            const pad = (x, len) => {
                while (chalk.stripColor(x).length < len) {
                    x += ' ';
                }
                return x;
            };
            const pad_col = (table, col) => {
                const maxlen = Math.max(...table.map(row => chalk.stripColor(row[col]).length));
                for (const row of table) {
                    row[col] = pad(row[col], maxlen);
                }
            };
            const table = [];
            for (const name of Object.keys(runner._tasks)) {
                const task = runner._tasks[name];
                table.push([
                    task.name + (task.deps.length ? chalk.grey(` -> [${task.deps.join(', ')}]`) : ''),
                    task.desc ? task.desc : ''
                ]);
            }
            pad_col(table, 0);

            let s = '\n';
            if (runner._defaults.length) {
                s += `  Defaults: ${runner._defaults.join(', ')}\n\n`;
            }
            s += '  Tasks:\n\n';
            if (table.length) {
                for (const row of table) {
                    s += `    ${row[0]}    ${row[1]}\n`;
                }
            } else {
                s += `    ${chalk.grey('(no runner)')}\n`;
            }

            console.log(s);
        } else if (options.listTasks) {
            console.log(Object.keys(runner._tasks).join('\n'));
        } else if (options.listDefaults) {
            console.log(runner._defaults.join('\n'));
        } else {
            return runner.run(options.sequence, options.args);
        }
        return undefined;
    });
};

const cli_before_exit_hook = runner => {
    process.on('beforeExit', once(() => {
        if (runner.cli_before_exit && (runner._defaults.length || Object.keys(runner._tasks).length)) {
            return cli(runner).catch(err => console.log(err.stack));
        }
        return undefined;
    }));
};

module.exports = {
    cli,
    cli_before_exit_hook,
    parse_cmdline_args
};
