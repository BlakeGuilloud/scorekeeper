import fs from 'fs';
import path from 'path';

import {
  convertUtfDataToArray,
  parseMatchesToObjects,
  calculatePointTotal,
  buildTxtFile,
  generateRankingsTxt,
  sortCalculatedPointTotal
} from './utils';

module.exports = (dirname = __dirname, fileName = 'scores.txt') => {
  const filePath = path.resolve(dirname, fileName);
  const fileData = fs.readFileSync(filePath, 'utf8');

  const rawScoresData = convertUtfDataToArray(fileData);
  const parsedMatchesData = parseMatchesToObjects(rawScoresData);
  const calculatedTotal = calculatePointTotal(parsedMatchesData);
  const sorted = sortCalculatedPointTotal(calculatedTotal);
  const rankingsTxt = generateRankingsTxt(sorted);

  return buildTxtFile(rankingsTxt, dirname);
};