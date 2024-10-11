const { initMaze, getUnvisitedNighbors } = require('./utils');

module.exports = {
    default: {
        primsAlgorithm,
        addAdjacentCells,
    },
};

function primsAlgorithm(width, height, startRow, startCol, endRow, endCol) {
    var maze = initMaze(width, height);
    maze.compilationMaze[2*startRow][2*startCol] = 1;
    maze.visualizeMaze[2*startRow][2*startCol] = 2;

    var adjacentCells = [];
    addAdjacentCells(adjacentCells, maze.compilationMaze, [startRow, startCol]);
    while (adjacentCells.length > 0) {
        const cell = adjacentCells[Math.floor(Math.random() * adjacentCells.length)];
        adjacentCells = adjacentCells.filter(c => c !== cell);
        if (maze.compilationMaze[cell[1][0]][cell[1][1]] === 1) {
            continue;
        }
        maze.compilationMaze[cell[1][0]][cell[1][1]] = 1;
        maze.visualizeMaze[cell[0][0] + cell[1][0]][cell[0][1] + cell[1][1]] = 1;
        addAdjacentCells(adjacentCells, maze.compilationMaze, cell[1]);
    }
    maze.visualizeMaze[2 * endRow][2 * endCol] = 3;
    return maze.visualizeMaze;
}

function addAdjacentCells(adjacentCells, compilationMaze, cell) {
    const unvisitedNighbors = getUnvisitedNighbors(compilationMaze, cell[0], cell[1]);
    for (let [row, col] of unvisitedNighbors) {
        adjacentCells.push([[cell[0], cell[1]], [row, col]]);
    }
}

// WALL = 0
// PATH = 1
// START = 2
// END = 3

// visualizeMaze
// -----------------
// | 1 0 1 0 1 0 1 |
// | 0 0 0 0 0 0 0 |
// | 1 0 1 0 1 0 1 |
// | 0 0 0 0 0 0 0 |
// | 1 0 1 0 1 0 1 |
// | 0 0 0 0 0 0 0 |
// | 1 0 1 0 1 0 1 |
// -----------------

// comilationMaze
// 2 * row_c = row_v
// 2 * col_c = col_v
