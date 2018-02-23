import fs from 'fs';
import path from 'path';

import {
  reduceGameData,
  reduceTeamScores,
  sortByPoints,
  assignRanks
} from './utils';

module.exports = (dirname, fileName) => {
  const filePath = path.resolve(dirname, fileName);
  const fileData = fs.readFileSync(filePath, 'utf8');

  return parseAndRankData(fileData);
};

function parseAndRankData(data) {
  const parsedAndSortedData = data
    .trim()
    .split('\n')
    .map(el => el.trim())
    .reduce(reduceGameData, [])
    .reduce(reduceTeamScores, [])
    .map(({ name, points, }) => ({ name, points, }))
    .sort(sortByPoints);

  return assignRanks(parsedAndSortedData);
}