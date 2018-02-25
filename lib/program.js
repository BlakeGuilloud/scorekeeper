#!/usr/bin/env node
import program from 'commander';

import scorekeeper from './';

program
  .command('report <file> <dest>')
  .action((file, dest) => {
    scorekeeper(__dirname, file, dest);
  });

program.parse(process.argv);