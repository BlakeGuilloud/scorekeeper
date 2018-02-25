import fs from 'fs';
import path from 'path';
import emoji from 'node-emoji';

import {
  assignRanks,
  parseAndSortData
} from './utils';

module.exports = (dirname = process.cwd(), fileName, dest) => {
  const filePath = path.resolve(dirname, fileName);
  const fileData = fs.readFileSync(filePath, 'utf8');

  const rankings = assignRanks(parseAndSortData(fileData))
    .map(({ name, points, rank, }) => `${rank}. ${name} ${points}`)
    .join('\n');

  console.log(emoji.get('hammer'), ' Writing to file...'); // eslint-disable-line no-console

  const destPath = path.resolve(dirname, dest);

  fs.writeFileSync(destPath, rankings);

  console.log(emoji.get('balloon'), ' File written to: ', destPath); // eslint-disable-line no-console

  return rankings;
};
