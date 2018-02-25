
export function assignRanks(parsedAndSortedData) {
  let rank = 1;
  let skipRank = 0;

  return parsedAndSortedData.map((item, idx) => {
    const currentTeam = item;
    const previousTeam = idx > 0 ? parsedAndSortedData[idx - 1] : { points: -1, };

    if (currentTeam.points < previousTeam.points) {
      rank = rank + 1 + skipRank;
      skipRank = 0;
    } else if (currentTeam.points === previousTeam.points) {
      skipRank++;
    }

    item.rank = rank;

    return item;
  });
}

export function sortByPoints(a, b) {
  if (a.points === b.points) {
    return a.name > b.name;
  }

  return a.points < b.points;
}

export function reduceTeamScores(acc, currVal) {
  const { team1, team2, } = assignPoints(currVal);

  const team1Idx = acc.findIndex(el => el.name === team1.name);

  if (team1Idx === -1) {
    acc.push(team1);
  } else {
    acc[team1Idx] = Object.assign(acc[team1Idx], { points: acc[team1Idx].points + team1.points, });
  }

  const team2Idx = acc.findIndex(el => el.name === team2.name);

  if (team2Idx === -1) {
    acc.push(team2);
  } else {
    acc[team2Idx] = Object.assign(acc[team2Idx], { points: acc[team2Idx].points + team2.points, });
  }

  return acc;
}

export function assignPoints(game) {
  const [team1, team2] = game;

  if (team1.score > team2.score) {
    team1.points += 3;
  } else if (team1.score < team2.score) {
    team2.points += 3;
  } else if (team1.score === team2.score) {
    team1.points += 1;
    team2.points += 1;
  }

  // Remove `score` property as it is no longer needed;
  delete team1.score;
  delete team2.score;

  return { team1, team2, };
}

export function reduceGameData(acc, currVal) {
  return acc.concat([
    currVal
      .split(', ')
      .map((item) => {
        return {
          name: item.slice(0, item.length - 1).trim(),
          score: Number(item.slice(item.length - 1)),
          points: 0,
        };
      })
  ]);
}

export function parseAndSortData(data) {
  return data
    .trim()
    .split('\n')
    .map(el => el.trim())
    .reduce(reduceGameData, [])
    .reduce(reduceTeamScores, [])
    .sort(sortByPoints);
}