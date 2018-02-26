#!/usr/bin/env node
import program from 'commander';

import scorekeeper from './';

program
  .version('1.0.0')
  .command('report <file>')
  .option('-d, --dest [dest]', 'Write to local file')
  .action((file, cmd) => {
    scorekeeper(file, cmd.dest);
  });

program.parse(process.argv);