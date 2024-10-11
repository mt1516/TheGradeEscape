const { initMaze, getUnvisitedNighbors } = require('./utils');

module.exports = {
    default: {
        recursiveBacktracing
    },
};

function recursiveBacktracing(width, height, startRow, startCol, endRow, endCol) {
    var maze = initMaze(width, height);
    maze.compilationMaze[startRow][startCol] = 1;
    maze.visualizeMaze[2*startRow][2*startCol] = 2;
    const stack = []
    stack.push([startRow, startCol]);
    while (stack.length>0) {
        const [row, col] = stack.pop();
        const neighbors = getUnvisitedNighbors(maze.compilationMaze, row, col);
        if (neighbors.length > 0) {
            stack.push([row, col]);
            const chosenNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
            maze.compilationMaze[chosenNeighbor[0]][chosenNeighbor[1]] = 1;
            maze.visualizeMaze[row + chosenNeighbor[0]][col + chosenNeighbor[1]] = 1;
            stack.push(chosenNeighbor)
        }
    }
    maze.visualizeMaze[2*endRow][2*endCol] = 3;
    return maze.visualizeMaze;
}

// function initRecursiveTracingMaze(width, height) {
//     return initMaze(width, height);
// }



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
