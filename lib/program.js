#!/usr/bin/env node
import program from 'commander';

import scorekeeper from './';

program
  .version('1.0.0')
  .command('report <file> <dest>')
  .action((file, dest) => {
    scorekeeper(file, dest);
  });

program.parse(process.argv);