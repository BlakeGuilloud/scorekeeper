#!/usr/bin/env node
import program from 'commander';

import scorekeeper from './';

program
  .version('1.0.0')
  .command('report <file> <dest>')
  .option('-d, --dirname <dirname>', 'Optional directory to write file. Defaults to process.cwd()')
  .action((file, dest, cmd) => {
    const dirname = cmd.dirname || process.cwd();

    scorekeeper(dirname, file, dest);
  });

program.parse(process.argv);