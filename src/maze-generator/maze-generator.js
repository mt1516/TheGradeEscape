const { initMaze, getUnvisitedNighbors, addAdjacentCells, union, find } = require('./utils');

module.exports = {
    default: {
        recursiveBacktracing,
        primsAlgorithm,
        ellersAlgorithm,
    },
};

function mazeGenerator(width, height, startRow, startCol, endRow, endCol, complexity) {
    switch (complexity) {
        case 1:
            return primsAlgorithm(width, height, startRow, startCol, endRow, endCol);
        case 2:
            return ellersAlgorithm(width, height, startRow, startCol, endRow, endCol);
        case 3:
            return recursiveBacktracing(width, height, startRow, startCol, endRow, endCol);
        default:
            return recursiveBacktracing(width, height, startRow, startCol, endRow, endCol);
    }

}

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

function ellersAlgorithm(width, height, startRow, startCol, endRow, endCol, probability=0.5) {
    // Step 1: Initialize the maze
    const maze = initMaze(width, height).visualizeMaze;
    const sets = []; // List to hold sets of cells for union-find structure
    maze[2 * startRow][2 * startCol] = 2; // Mark the start cell

    // Step 2: Create the first row of the maze
    for (let col = 0; col < maze[0].length; col+=2) {
        const set = { cells: [[0, col]], id: col }; // Create a new set for the cell (0, col)
        sets.push(set);
    }

    // Step 3: Process each subsequent row
    for (let row = 2; row < maze.length; row+=2) {
        // Step 3a: Create a new set for each cell in the current row
        for (let col = 0; col <  maze[0].length; col+=2) {
            const set = { cells: [[row, col]], id: col }; // New set for the cell
            sets.push(set);
        }

        // Step 3b: Connect cells within the current row
        for (let col = 2; col <  maze[0].length; col+=2) {
            if (Math.random() < probability) { // Randomly decide whether to connect to the left
                union(sets, row, col, row, col - 2);
                maze[row][col - 1] = 1;
            }
        }

        // Step 3c: Connect cells to the row above
        for (let col = 0; col <  maze[0].length; col+=2) {
            if (find(sets, row, col) !== find(sets, row - 2, col)) {
                union(sets, row, col, row - 2, col);
                maze[row - 1][col] = 1;
            }
        }
    }

    // Step 4: Remove walls for the last row
    for (let col = 2; col <  maze[0].length; col+=2) {
        // Connect to the left if it is not inside the set yet
        if (find(sets, maze.length - 1, col) !== find(sets, maze.length - 1, col - 2)) {
            union(sets, maze.length - 1, col, maze.length - 1, col - 2);
            maze[maze.length - 1][col - 1] = 1;
        }
    }
    maze[2 * endRow][2 * endCol] = 3; // Mark the end cell

    return maze;
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
