import { initMaze, getUnvisitedNighbors, addAdjacentCells, union, find } from './utils';

// WALL = 0
// PATH = 1
// END = 2
// START = 3

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

// All maze start generates at exit to ensure there is only 1 path to the exit but multiple path out from start

function mazeGenerator(width, height, startRow, startCol, endRow, endCol, complexity) {
    switch (complexity) {
        case 0:
            return primsAlgorithm(width, height, startRow, startCol, endRow, endCol);
        case 1:
            return ellersAlgorithm(width, height, startRow, startCol, endRow, endCol);
        case 2:
            return recursiveBacktracing(width, height, startRow, startCol, endRow, endCol);
        default:
            return recursiveBacktracing(width, height, startRow, startCol, endRow, endCol);
    }

}

function recursiveBacktracing(width, height, startRow, startCol, endRow, endCol) {
    // Step 1: Initialize the maze
    var maze = initMaze(width, height);
    maze.compilationMaze[endRow][endCol] = 1; // Mark the start cell
    maze.visualizeMaze[2*endRow][2*endCol] = 2; // Mark the start cell

    const stack = [] // Stack to hold cells, which can be pop out to be searched later
    // Step 2: Push the starting cell
    stack.push([endRow, endCol]);
    // Step 3: Start recursion
    while (stack.length>0) {
        // Step 3a: Pop the last cell out
        const [row, col] = stack.pop();
        // Step 3b: Get all the unvisited neighbours of the current cell
        const neighbors = getUnvisitedNighbors(maze.compilationMaze, row, col);
        // Step 3c: Check if there is any cell not visited, if yes, the path havent reach a dead end, which can be continue to search deeper
        if (neighbors.length > 0) {
            // Step 3d: Push back from backtracing
            stack.push([row, col]);
            // Step 3e: Random choose one for searching 
            const chosenNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
            maze.compilationMaze[chosenNeighbor[0]][chosenNeighbor[1]] = 1;
            maze.visualizeMaze[row + chosenNeighbor[0]][col + chosenNeighbor[1]] = 1;
            // Step 3f: Push back for next iteration
            stack.push(chosenNeighbor)
        }
    }
    // Step 4: Mark the end of the maze
    maze.visualizeMaze[2*startRow][2*startCol] = 3;

    return maze.visualizeMaze;
}

function primsAlgorithm(width, height, startRow, startCol, endRow, endCol) {
    // Step 1: Initialize the maze
    var maze = initMaze(width, height);
    maze.compilationMaze[endRow][endCol] = 1; // Mark the start cell
    maze.visualizeMaze[2*endRow][2*endCol] = 2; // Mark the start cell

    var adjacentCells = []; // List to hold 2 cells, which shows the wall
    // Step 2: Push all walls of the starting cell
    addAdjacentCells(adjacentCells, maze.compilationMaze, [endRow, endCol]);
    // Step 3: Start recursion
    while (adjacentCells.length > 0) {
        // Step 3a: Randomly choose one wall out and remove it from the list
        const cell = adjacentCells[Math.floor(Math.random() * adjacentCells.length)];
        adjacentCells = adjacentCells.filter(c => c !== cell);
        // Step 3b: Skip if the cell is already visited
        if (maze.compilationMaze[cell[1][0]][cell[1][1]] === 1) {
            continue;
        }
        // Step 3c: Mark visited and break the wall between
        maze.compilationMaze[cell[1][0]][cell[1][1]] = 1;
        maze.visualizeMaze[cell[0][0] + cell[1][0]][cell[0][1] + cell[1][1]] = 1;
        // Step 3d: Add all walls of the newly visited cell
        addAdjacentCells(adjacentCells, maze.compilationMaze, cell[1]);
    }
    // Step 4: Mark the end of the maze
    maze.visualizeMaze[2 * startRow][2 * startCol] = 3;
    
    return maze.visualizeMaze;
}

function ellersAlgorithm(width, height, startRow, startCol, endRow, endCol, probability=0.5) {
    // Step 1: Initialize the maze
    const maze = initMaze(width, height).visualizeMaze;
    const sets = []; // List to hold sets of cells for union-find structure
    maze[2 * endRow][2 * endCol] = 2; // Mark the start cell

    // Step 2: Process each subsequent row
    for (let row = 0; row < maze.length; row+=2) {
        // Step 2a: Create a new set for each cell in the current row
        for (let col = 0; col <  maze[0].length; col+=2) {
            const set = { cells: [[row, col]], id: row * maze[0].length + col }; // New set for the cell
            sets.push(set);
        }

        // Step 2b: Connect cells within the current row
        for (let col = 2; col <  maze[0].length; col+=2) {
            if (Math.random() < probability) { // Randomly decide whether to connect to the left
                union(sets, row, col, row, col - 2);
                maze[row][col - 1] = 1;
            }
        }

        // Step 2c: Connect cells to the row above
        if (row > 0) {
            let order = [];
            for (let col = 0; col <  maze[0].length; col+=2) {
                order.push(col);
            }
            // swap the order of the columns randomly to avoid connecting all col 0 cells
            let randomIndex = Math.floor(Math.random() * order.length);
            let temp = order[randomIndex];
            order[randomIndex] = order[0];
            order[0] = temp;
            for (let col of order) {
                if (find(sets, row, col) !== find(sets, row - 2, col)) {
                    union(sets, row, col, row - 2, col);
                    maze[row - 1][col] = 1;
                }
            }
        }
    }
    // Step 3: Mark the end of the maze
    maze[2 * startRow][2 * startCol] = 3; // Mark the end cell

    return maze;
}

export {
    mazeGenerator,
    recursiveBacktracing,
    primsAlgorithm,
    ellersAlgorithm,
};