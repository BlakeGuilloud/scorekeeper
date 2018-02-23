import fs from 'fs';
import path from 'path';

export function convertUtfDataToArray(data) {
  if (typeof data !== 'string') {
    throw new Error(`Expected ${data} to be type String. Received: ${typeof data}.`);
  }

  return data.toString()
    .trim() // trim initial utf string
    .split('\n') // split string at linebreaks into array
    .map(i => i.trim()); // map over array and trim any excess spaces
}


export function parseMatchesToObjects(arr) {
  if (!Array.isArray(arr)) {
    throw new Error(`Expected ${arr} to be type Array. Received: ${typeof arr}.`);
  }

  return arr.reduce((acc, currVal, idx) => {
    acc[idx] = formatGame(currVal);

    return acc;
  }, []);

  function formatGame(game) {
    if (typeof game !== 'string') {
      throw new Error(`Expected ${game} to be type String. Received: ${typeof game}.`);
    }

    return game.split(', ')
      .reduce((acc, currVal, idx) => {
        const arrayOfGameData = currVal.split(' ');
        const lastIndexOfArrayOfGameData = arrayOfGameData.length - 1;

        const name = arrayOfGameData.slice(0, lastIndexOfArrayOfGameData).join(' '); // slice out everything expect for the score- resolves issue of multi-word teams like "Red Pandas"
        const score = Number(arrayOfGameData[lastIndexOfArrayOfGameData]); // convert "score" to number for accurate mathmatical operations

        acc[idx] = { name, score, };

        return acc;
      }, []);
  }
}


export function calculatePointTotal(arrOfGames) {
  if (!Array.isArray(arrOfGames)) {
    throw new Error(`Expected ${arrOfGames} to be type Array. Received: ${typeof arrOfGames}.`);
  }

  return arrOfGames.reduce((acc, currVal) => {
    const [team1, team2] = currVal;
    let team1Points = 0;
    let team2Points = 0;

    if (team1.score > team2.score) {
      team1Points = 3;
    } else if (team2.score > team1.score) {
      team2Points = 3;
    } else {
      team1Points = 1;
      team2Points = 1;
    }

    acc[team1.name] = {
      name: team1.name,
      points: acc[team1.name] ? acc[team1.name].points + team1Points : team1Points,
    };

    acc[team2.name] = {
      name: team2.name,
      points: acc[team2.name] ? acc[team2.name].points + team2Points : team2Points,
    };

    return acc;
  }, {});
}

export function generateRankingsTxt(sortedRankings) {
  let rank = 1;
  let skipRank = 0;

  return sortedRankings.map((item, idx) => {
    const currentTeam = item;
    const previousTeam = idx > 0 ? sortedRankings[idx - 1] : {};

    const shouldRankIncrement = currentTeam.points < previousTeam.points;

    if (shouldRankIncrement) {
      rank = rank + 1 + skipRank;
    }

    if (currentTeam.points === previousTeam.points) {
      skipRank++;
    }

    if (shouldRankIncrement) {
      skipRank = 0;
    }

    return `${rank}. ${item.name} ${item.points}\n`;
  }).join('');
}

export function sortCalculatedPointTotal(calculatedTotal) {
  return Object.keys(calculatedTotal).sort((a, b) => {
    if (calculatedTotal[a].points === calculatedTotal[b].points) {
      return a < b;
    }

    return calculatedTotal[a].points < calculatedTotal[b].points;
  }).map(item => calculatedTotal[item]);
}

export function buildTxtFile(rankings, dirname) {
  const fileDest = path.resolve(dirname, 'ranks.txt');

  fs.writeFileSync(fileDest, rankings, 'utf8');

  return {
    rankings,
    fileDest,
  };
}