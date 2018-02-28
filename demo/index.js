const scorekeeper = require('../dist');

const fileName = 'demo/scores.txt';

// .env variable set in npm script for demo purposes.
if (process.env.DEMO_ENV === 'write') {
  // Generate "unique" fileDest name for no conflicts.
  const fileDest = `demo/${Date.now()}-ranks.txt`;

  // Provide fileDest, and the function will write to a local file
  scorekeeper({ fileName, fileDest });

} else {
  // No fileDest is provided, so this function just logs.
  scorekeeper({ fileName });
}
