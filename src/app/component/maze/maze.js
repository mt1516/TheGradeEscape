import { getUnvisitedNighbors, addAdjacentCells, union, find } from './utils';
import settings from './settings.json';

class Maze {
    constructor(mode = "default", level = "easy") {
        if (!settings[mode][level]) {
            throw new Error(`Mode "${mode}"; Level "${level}"; is not defined in settings.json`);
        }
        this.width = settings[mode][level].width;
        this.height = settings[mode][level].height;
        this.startRow = settings[mode][level].startRow;
        this.startCol = settings[mode][level].startCol;
        this.endRow = settings[mode][level].endRow;
        this.endCol = settings[mode][level].endCol;
        this.complexity = settings[mode][level].complexity;
        this.cellSize = settings[mode][level].cellSize;
        this.initMaze();
        this.scale();
    }

    initMaze() {
        this.visualize = new Array(2 * this.height - 1);
        this.compilationMaze = new Array(this.height).fill(0).map(() => new Array(this.width).fill(0));
        for (let i=0; i<2*this.height-1; i++) {
            this.visualize[i] = new Array(2 * this.width - 1).fill(0);
            for (let j=0; j<2*this.width-1; j++) {
                if (i % 2 === 0 && j % 2 === 0) {
                    this.visualize[i][j] = 1;
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
        this.compilationMaze[this.endRow][this.endCol] = 1; // Mark the start cell
        this.visualize[2*this.endRow][2*this.endCol] = 2; // Mark the start cell

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
                this.visualize[row + chosenNeighbor[0]][col + chosenNeighbor[1]] = 1;
                // Step 3f: Push back for next iteration
                stack.push(chosenNeighbor)
            }
        }
        // Step 4: Mark the end of the maze
        this.visualize[2*this.startRow][2*this.startCol] = 3;
    }

    primsAlgorithm() {
        // Step 1: Initialize the maze
        this.compilationMaze[this.endRow][this.endCol] = 1; // Mark the start cell
        this.visualize[2*this.endRow][2*this.endCol] = 2; // Mark the start cell

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
            this.visualize[cell[0][0] + cell[1][0]][cell[0][1] + cell[1][1]] = 1;
            // Step 3d: Add all walls of the newly visited cell
            addAdjacentCells(adjacentCells, this.compilationMaze, cell[1]);
        }
        // Step 4: Mark the end of the maze
        this.visualize[2 * this.startRow][2 * this.startCol] = 3;
    }

    ellersAlgorithm() {
        // Step 1: Initialize the maze
        let sets = []; // List to hold sets of cells for union-find structure
        this.visualize[2 * this.endRow][2 * this.endCol] = 2; // Mark the start cell
        const total_row = 2 * this.height - 1;
        const total_col = 2 * this.width - 1;
        const probability = 0.5;

        // Step 2: Process each subsequent row
        for (let row = 0; row < total_row; row+=2) {
            // Step 2a: Create a new set for each cell in the current row
            for (let col = 0; col < total_col; col+=2) {
                const set = { cells: [[row, col]], id: row * this.visualize[0].length + col }; // New set for the cell
                sets.push(set);
            }

            // Step 2b: Connect cells within the current row
            for (let col = 2; col < total_col; col+=2) {
                if (Math.random() < probability) { // Randomly decide whether to connect to the left
                    union(sets, row, col, row, col - 2);
                    this.visualize[row][col - 1] = 1;
                }
            }

            // Step 2c: Connect cells to the row above
            if (row > 0) {
                let order = [];
                for (let col = 0; col <  this.visualize[0].length; col+=2) {
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
                        this.visualize[row - 1][col] = 1;
                    }
                }
            }
        }

        // Step 3: Mark the end of the maze
        this.visualize[2 * this.startRow][2 * this.startCol] = 3; // Mark the end cell
    }
    // 00 --> 00-02
    // 01 --> 03
    // 02 --> 04-06
    // 03 --> 07
    scale() {
        console.log("visualize = ", this.visualize);
        this.visualizeMaze = new Array(this.height - 1 + this.height * this.cellSize)
        for (let i=0; i<this.visualizeMaze.length; i++) {
            this.visualizeMaze[i] = new Array(this.width - 1 + this.width * this.cellSize).fill(1);
            for (let j=0; j<this.visualizeMaze[0].length; j++) {
                if ((i-3) % 4 === 0 || (j-3) % 4 === 0) {
                    this.visualizeMaze[i][j] = 0;
                }
            }
        }
        // console.log("visualizeMaze.size = ", this.visualizeMaze.length, this.visualizeMaze[0].length);
        var visualRow = 0;
        var visualCol = this.cellSize;
        for (let row=0; row<this.visualize.length; row+=2) {
            for (let col=1; col<this.visualize[0].length; col+=2) {
                if (this.visualize[row][col] === 1) {
                    for (let i=0; i<this.cellSize; i++) {
                        this.visualizeMaze[visualRow + i][visualCol] = 1;
                    }
                }
                visualCol += this.cellSize + 1;
                if (visualCol === this.visualizeMaze[0].length) {
                    visualCol = this.cellSize;
                    visualRow += this.cellSize + 1;
                }
            }
        }
        visualRow = this.cellSize;
        visualCol = 0;
        for (let col=0; col<this.visualize[0].length; col+=2) {
            for (let row=1; row<this.visualize.length; row+=2) {
                if (this.visualize[row][col] === 1) {
                    for (let i=0; i<this.cellSize; i++) {
                        this.visualizeMaze[visualRow][visualCol + i] = 1;
                    }
                }
                visualRow += this.cellSize + 1;
                if (visualRow === this.visualizeMaze.length) {
                    visualRow = this.cellSize;
                    visualCol += this.cellSize + 1;
                }
            }
        }

        console.log("visualizeMaze = ", this.visualizeMaze);
        // console.log("connecting the rows");
        // for (let row=0; row<this.visualize.length; row++) {
        //     var startCol = 0;
        //     var endCol = Math.floor(this.cellSize/2);
        //     for (let col=0; col<this.visualize[0].length; col++) {
        //     // for (let col=0; col<3; col++) {
        //         let actualRow = this.cellSize + (1 + this.cellSize) * Math.floor(row/2);
        //         if (col === 0) {
        //             if (this.visualize[row][col] === 0) {
        //                 // let endCol = Math.floor(this.cellSize/2);
        //                 // console.log("row, col, actualRow = ", row, col, actualRow);
        //                 // console.log("endCol = ", endCol);
        //                 for (let k=0; k<=endCol; k++) {
        //                     this.visualizeMaze[actualRow][k] = 0;
        //                 }
        //             }
        //             startCol = endCol;
        //             endCol = startCol + 2 * (this.cellSize - 1);
        //             continue;
        //         }
        //         if (col === this.visualize[0].length - 1) {
        //             continue;
        //         }
        //         if (this.visualize[row][col - 1] === 0 && this.visualize[row][col] === 0) {
        //             // let startCol = this.cellSize + (1 + this.cellSize) * Math.floor((col-1)/2);
        //             // let endCol = this.cellSize + (1 + this.cellSize) * Math.floor(col/2);
        //             console.log("row, col, actualRow = ", row, col, actualRow);
        //             console.log("startCol, endCol = ", startCol, endCol);
        //             for (let k=startCol; k<=endCol; k++) {
        //                 console.log("row, k = ", actualRow, k);
        //                 this.visualizeMaze[actualRow][k] = 0;
        //             }
        //         }
        //         startCol = endCol;
        //         endCol = startCol + 2 * (this.cellSize - 1);
        //     }
        // }
        return;

        // console.log("connecting the cols");
        // for (let col=0; col<this.visualize[0].length; col++) {
        //     var startRow = 0;
        //     var endRow = Math.floor(this.cellSize/2);
        //     // for (let row=0; row<this.visualize.length; row++) {
        //     for (let row=0; row<5; row++) {
        //         let actualCol = this.cellSize + (1 + this.cellSize) * Math.floor(col/2);
        //         if (row === 0) {
        //             if (this.visualize[row][col] === 0) {
        //                 // let endRow = Math.floor(this.cellSize/2);
        //                 for (let k=0; k<=endRow; k++) {
        //                     this.visualizeMaze[k][actualCol] = 0;
        //                 }
        //             }
        //             startRow = endRow;
        //             endRow = startRow + 2 * (this.cellSize - 1);
        //             continue;
        //         }
        //         if (row === this.visualize[0].length - 1) {
        //             continue;
        //         }
        //         if (this.visualize[row - 1][col] === 0 && this.visualize[row][col] === 0) {
        //             // let startRow = this.cellSize + (1 + this.cellSize) * Math.floor((row-1)/2);
        //             // let endRow = this.cellSize + (1 + this.cellSize) * Math.floor(row/2);
        //             console.log("row, col, actualCol = ", row, col, actualCol);
        //             console.log("startRow, endRow = ", startRow, endRow);
        //             for (let k=startRow; k<=endRow; k++) {
        //                 console.log("k, col = ", k, actualCol);
        //                 this.visualizeMaze[k][actualCol] = 0;
        //             }
        //         }
        //         startRow = endRow;
        //         endRow = startRow + 2 * (this.cellSize - 1);
        //     }
        // }

        // for (let col=0; col<this.visualize[0].length; col++) {
        //     for (let row=1; row<this.visualize.length; row++) {
        //         let actualCol = (Math.floor(col/2) + 1) * this.cellSize + Math.floor(col/2)
        //         if (row === 0) {
        //             if (this.visualize[row][col] === 0) {
        //                 let endRow = Math.floor(this.cellSize/2);
        //                 for (let k=0; k<endRow; k++) {
        //                     this.visualizeMaze[k][actualCol] = 0;
        //                 }
        //             }
        //             continue;
        //         }
        //         if (this.visualize[row - 1][col] === 0 && this.visualize[row][col] === 0) {
        //             let startRow = (row - 1) * (this.cellSize + 1) + 1;
        //             let endRow = row * (this.cellSize + 1) + 1;
        //             for (let k=startRow; k<=endRow; k++) {
        //                 console.log("k, col = ", k, actualCol);
        //                 this.visualizeMaze[k][actualCol] = 0;
        //             }
        //         }
        //     }
        // }
    }
}

export default Maze;