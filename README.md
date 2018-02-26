## Scorekeeper

### Objective
Scorekeeper is a CLI tool for parsing through a .txt file of tournament scores, calculating rankings, and writing the rankings to a .txt file. It is designed to accept a single .txt file of game scores as input, and output a .txt file of tournament rankings based on the following scoring format:
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

### Local Development / Demo
This application is developed using [yarn](https://yarnpkg.com/en/) for package management. Using `npm` for project dependencies has not been tested, but should subsitute just fine.
```
$ git clone https://github.com/BlakeGuilloud/scorekeeper.git

$ cd scorekeeper && yarn // OR npm install

$ yarn test // triggers Jest test suite

$ yarn demo // runs a demonstration of the core-app
```

### Usage
```
$ npm install -g scorekeeper

$ scorekeeper report <source> <dest>
```