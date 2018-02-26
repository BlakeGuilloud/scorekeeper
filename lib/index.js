import fs from 'fs';
import path from 'path';

import {
  normalizeFileData,
  assignRanks,
  parseAndSortData,
  readFileData,
  reduceGameData,
  reduceTeamPoints,
  sortByPoints,
  writeToFileDest
} from './utils';

module.exports = (fileName, destName) => {
  if (typeof fileName !== 'string' || typeof destName !== 'string') {
    throw new Error('Invalid arguments provided.');
  }

  const fileData = readFileData(fileName);
  const cleanData = normalizeFileData(fileData);
  const parsedGameData = cleanData
    .reduce(reduceGameData, [])
    .reduce(reduceTeamPoints, [])
    .sort(sortByPoints);

  const rankings = assignRanks(parsedGameData)
    .map(({ name, points, rank }) => `${rank}. ${name} ${points}`)
    .join('\n');

  if (destName) {
    writeToFileDest(destName, rankings);
  }

  return rankings;
};
