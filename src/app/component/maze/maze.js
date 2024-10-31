import { getUnvisitedNighbors, addAdjacentCells, union, find } from './utils';
import settings from './settings.json';

class Maze {
    constructor(level = "default") {
        if (!settings[level]) {
            throw new Error(`Level "${level}" is not defined in settings.json`);
        }
        this.width = settings[level].width;
        this.height = settings[level].height;
        this.startRow = settings[level].startRow;
        this.startCol = settings[level].startCol;
        this.endRow = settings[level].endRow;
        this.endCol = settings[level].endCol;
        this.complexity = settings[level].complexity;
        this.cellSize = settings[level].cellSize;
        this.initMaze();
    }

    initMaze() {
        this.visualizeMaze = new Array(2 * this.height - 1);
        this.compilationMaze = new Array(this.height).fill(0).map(() => new Array(this.width).fill(0));
        for (let i=0; i<2*this.height-1; i++) {
            this.visualizeMaze[i] = new Array(2 * this.width - 1).fill(0);
            for (let j=0; j<2*this.width-1; j++) {
                if (i % 2 === 0 && j % 2 === 0) {
                    this.visualizeMaze[i][j] = 1;
                }
            }
        }

        switch (this.complexity) {
            case 0:
                this.primsAlgorithm();
                break;
            case 1:
                this.ellersAlgorithm();
                break;
            case 2:
                this.recursiveBacktracing();
                break;
            default:
                this.recursiveBacktracing();
        }
    }

    recursiveBacktracing() {
        // Step 1: Initialize the maze
        // this.initMaze();
        this.compilationMaze[this.endRow][this.endCol] = 1; // Mark the start cell
        this.visualizeMaze[2*this.endRow][2*this.endCol] = 2; // Mark the start cell

        // Step 2: Push the starting cell
        const stack = [] // Stack to hold cells, which can be pop out to be searched later
        stack.push([this.endRow, this.endCol]);

        // Step 3: Start recursion
        while (stack.length>0) {
            // Step 3a: Pop the last cell out
            const [row, col] = stack.pop();
            // Step 3b: Get all the unvisited neighbours of the current cell
            const neighbors = getUnvisitedNighbors(this.compilationMaze, row, col);
            // Step 3c: Check if there is any cell not visited, if yes, the path havent reach a dead end, which can be continue to search deeper
            if (neighbors.length > 0) {
                // Step 3d: Push back from backtracing
                stack.push([row, col]);
                // Step 3e: Random choose one for searching 
                const chosenNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
                this.compilationMaze[chosenNeighbor[0]][chosenNeighbor[1]] = 1;
                this.visualizeMaze[row + chosenNeighbor[0]][col + chosenNeighbor[1]] = 1;
                // Step 3f: Push back for next iteration
                stack.push(chosenNeighbor)
            }
        }
        // Step 4: Mark the end of the maze
        this.visualizeMaze[2*this.startRow][2*this.startCol] = 3;

        // return this.visualizeMaze;
    }

    primsAlgorithm() {
        // Step 1: Initialize the maze
        this.compilationMaze[this.endRow][this.endCol] = 1; // Mark the start cell
        this.visualizeMaze[2*this.endRow][2*this.endCol] = 2; // Mark the start cell

        let adjacentCells = []; // List to hold 2 cells, which shows the wall
        // Step 2: Push all walls of the starting cell
        addAdjacentCells(adjacentCells, this.compilationMaze, [this.endRow, this.endCol]);
        // Step 3: Start recursion
        while (adjacentCells.length > 0) {
            // Step 3a: Randomly choose one wall out and remove it from the list
            const cell = adjacentCells[Math.floor(Math.random() * adjacentCells.length)];
            adjacentCells = adjacentCells.filter(c => c !== cell);
            // Step 3b: Skip if the cell is already visited
            if (this.compilationMaze[cell[1][0]][cell[1][1]] === 1) {
                continue;
            }
            // Step 3c: Mark visited and break the wall between
            this.compilationMaze[cell[1][0]][cell[1][1]] = 1;
            this.visualizeMaze[cell[0][0] + cell[1][0]][cell[0][1] + cell[1][1]] = 1;
            // Step 3d: Add all walls of the newly visited cell
            addAdjacentCells(adjacentCells, this.compilationMaze, cell[1]);
        }
        // Step 4: Mark the end of the maze
        this.visualizeMaze[2 * this.startRow][2 * this.startCol] = 3;

        // return this.visualizeMaze;
    }

    ellersAlgorithm() {
        // Step 1: Initialize the maze
        let sets = []; // List to hold sets of cells for union-find structure
        this.visualizeMaze[2 * this.endRow][2 * this.endCol] = 2; // Mark the start cell
        const total_row = 2 * this.height - 1;
        const total_col = 2 * this.width - 1;
        const probability = 0.5;

        // Step 2: Process each subsequent row
        for (let row = 0; row < total_row; row+=2) {
            // Step 2a: Create a new set for each cell in the current row
            for (let col = 0; col < total_col; col+=2) {
                const set = { cells: [[row, col]], id: row * this.visualizeMaze[0].length + col }; // New set for the cell
                sets.push(set);
            }

            // Step 2b: Connect cells within the current row
            for (let col = 2; col < total_col; col+=2) {
                if (Math.random() < probability) { // Randomly decide whether to connect to the left
                    union(sets, row, col, row, col - 2);
                    this.visualizeMaze[row][col - 1] = 1;
                }
            }

            // Step 2c: Connect cells to the row above
            if (row > 0) {
                let order = [];
                for (let col = 0; col <  this.visualizeMaze[0].length; col+=2) {
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
                        this.visualizeMaze[row - 1][col] = 1;
                    }
                }
            }
        }

        // Step 3: Mark the end of the maze
        this.visualizeMaze[2 * this.startRow][2 * this.startCol] = 3; // Mark the end cell

        // return this.visualizeMaze;
    }
}

export default Maze;