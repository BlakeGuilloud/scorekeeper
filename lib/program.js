#!/usr/bin/env node
import program from 'commander';

import scorekeeper from './';

program
  .command('report <file> <dest>')
  .option('-dir --dirname <dirname>', 'Optional directory to write file. Defaults to process.cwd()')
  .action((file, dest, cmd) => {
    const dirname = cmd.dirname || process.cwd();

    scorekeeper(dirname, file, dest);
  });

program.parse(process.argv);