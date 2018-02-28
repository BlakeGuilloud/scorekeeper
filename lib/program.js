#!/usr/bin/env node
import program from 'commander';

import scorekeeper from './';

program
  .version('1.0.0')
  .command('report <file>')
  .option('-d, --dest [dest]', 'Write to local file')
  .action((file, cmd) => {
    const opts = {
      fileName: file,
      destName: cmd.dest,
    };

    scorekeeper(opts);
  });

program.parse(process.argv);