## Scorekeeper
[![Build Status](https://travis-ci.org/BlakeGuilloud/scorekeeper.svg?branch=master)](https://travis-ci.org/BlakeGuilloud/scorekeeper)
[![License](https://img.shields.io/npm/l/scorekeeper.svg)](https://github.com/BlakeGuilloud/scorekeeper/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/v/scorekeeper.svg)](https://www.npmjs.com/package/scorekeeper)


## Objective
Scorekeeper is a tool for parsing through a .txt file of tournament scores, calculating rankings, and writing the rankings to a .txt file. It is designed to accept a single .txt file of game scores as input, and output a .txt file of tournament rankings based on the following scoring format:
```
Win - 3 Points
Tie - 1 Point
Loss - 0 Points
```

The input .txt file should resemble the following format:
```
Falcons 30, Panthers 10
Green Giants 12, Red Pandas 35
Gophers 22, Vikings 22
Lions 12, Bears 24
Falcons 23, Bears 42
Red Pandas 10, Panthers 30
Green Giants 13, Gophers 13
Vikings 32, Lions 23
Falcons 23, Panthers 30
Red Pandas 10, Bears 42
Green Giants 13, Lions 23
Vikings 32, Gophers 13
```

and output the following:
```
1. Bears 9
2. Vikings 7
3. Panthers 6
4. Falcons 3
4. Lions 3
4. Red Pandas 3
7. Gophers 2
8. Green Giants 1
```

## CLI
### Installation
Installing scorekeeper globally maps an executable to the keyword "scorekeeper"
```
$ npm install scorekeeper -g
```

### Usage
#### report
`report` is current the only command for the scorekeeper CLI, as it prints, and (optionally) writes the rankings of a tournament.

Scorekeeper CLI requires a single argument: `<fileName>`, which should be a .txt file representing a list of scores.

```
$ scorekeeper report Scores.txt
```

Optional arguments:

The `-d` flag is used to mark a `<destinationName>`. When provided with a valid input, `-d` will write a report of the tournament rankings to a local file.

```
$ scorekeeper report Scores.txt -d Rankings.txt
```

## Package
### Installation
```
$ npm install scorekeeper --save
```

### Usage
Using the core package inside of a NodeJS project is easy!

The scorekeeper function accepts a single argument, an `options` Object.

```javascript
import scorekeeper from 'scorekeeper';

const options = {
  fileName: 'Scores.txt',
  destName: 'Rankings.txt', // optional
};

const rankings = scorekeeper(options);

// `rankings` will be a sorted Array of the tournament standings.
```

## Demo
This application is developed using [yarn](https://yarnpkg.com/en/) for package management. Using `npm` for project dependencies has not been tested, but should subsitute just fine.

```
$ git clone https://github.com/BlakeGuilloud/scorekeeper.git

$ cd scorekeeper && yarn // OR npm install

$ yarn test // Initiates unit testing written with the Jest library.
```

The core functionality of the application exists in the `/lib` folder of the project.

A demo of the application lives in `/demo`, and can be triggered using the following commands:
```
$ yarn demo // Prints tournament rankings from `/demo/scores.txt` to the console

$ yarn demo:write // Writes a .txt file containing tournament rankings to the `/demo` directory.
```

An application using this project can be found [here](http://scorekeeper-app.com.s3-website-us-east-1.amazonaws.com/).
