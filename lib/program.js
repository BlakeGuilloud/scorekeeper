#!/usr/bin/env node
import program from 'commander';

import scorekeeper from './';

program
  .command('report <file> <dest>')
  .action((file, dest) => {
    scorekeeper(process.cwd(), file, dest);
  });

program.parse(process.argv);