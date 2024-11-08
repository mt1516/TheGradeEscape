import { getUnvisitedNighbors, addAdjacentCells, union, find } from './utils';

class Maze {
    #compilation;
    constructor(setting) {
        this.width = setting.width;
        this.height = setting.height;
        this.startRow = setting.startRow;
        this.startCol = setting.startCol;
        this.endRow = setting.endRow;
        this.endCol = setting.endCol;
        this.complexity = setting.complexity;
        this.cellSize = setting.cellSize;
        this.#initMaze();
        this.#scale();
    }

    #initMaze() {
        this.mazeGrid = new Array(2 * this.height - 1);
        this.#compilation = new Array(this.height).fill(0).map(() => new Array(this.width).fill(0));
        for (let i=0; i<2*this.height-1; i++) {
            this.mazeGrid[i] = new Array(2 * this.width - 1).fill(0);
            for (let j=0; j<2*this.width-1; j++) {
                if (i % 2 === 0 && j % 2 === 0) {
                    this.mazeGrid[i][j] = 1;
                }
            }
        }

        switch (this.complexity) {
            case 0:
                this.#primsAlgorithm();
                break;
            case 1:
                this.#ellersAlgorithm();
                break;
            case 2:
                this.#recursiveBacktracing();
                break;
            default:
                this.#recursiveBacktracing();
        }
    }

    #recursiveBacktracing() {
        // Step 1: Initialize the maze
        this.#compilation[this.endRow][this.endCol] = 1; // Mark the start cell
        this.mazeGrid[2*this.endRow][2*this.endCol] = 3; // Mark the start cell

        // Step 2: Push the starting cell
        const stack = [] // Stack to hold cells, which can be pop out to be searched later
        stack.push([this.endRow, this.endCol]);

        // Step 3: Start recursion
        while (stack.length>0) {
            // Step 3a: Pop the last cell out
            const [row, col] = stack.pop();
            // Step 3b: Get all the unvisited neighbours of the current cell
            const neighbors = getUnvisitedNighbors(this.#compilation, row, col);
            // Step 3c: Check if there is any cell not visited, if yes, the path havent reach a dead end, which can be continue to search deeper
            if (neighbors.length > 0) {
                // Step 3d: Push back from backtracing
                stack.push([row, col]);
                // Step 3e: Random choose one for searching 
                const chosenNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
                this.#compilation[chosenNeighbor[0]][chosenNeighbor[1]] = 1;
                this.mazeGrid[row + chosenNeighbor[0]][col + chosenNeighbor[1]] = 1;
                // Step 3f: Push back for next iteration
                stack.push(chosenNeighbor)
            }
        }
        // Step 4: Mark the end of the maze
        this.mazeGrid[2*this.startRow][2*this.startCol] = 2;
    }

    #primsAlgorithm() {
        // Step 1: Initialize the maze
        this.#compilation[this.endRow][this.endCol] = 1; // Mark the start cell
        this.mazeGrid[2*this.endRow][2*this.endCol] = 3; // Mark the start cell

        let adjacentCells = []; // List to hold 2 cells, which shows the wall
        // Step 2: Push all walls of the starting cell
        addAdjacentCells(adjacentCells, this.#compilation, [this.endRow, this.endCol]);
        // Step 3: Start recursion
        while (adjacentCells.length > 0) {
            // Step 3a: Randomly choose one wall out and remove it from the list
            const cell = adjacentCells[Math.floor(Math.random() * adjacentCells.length)];
            adjacentCells = adjacentCells.filter(c => c !== cell);
            // Step 3b: Skip if the cell is already visited
            if (this.#compilation[cell[1][0]][cell[1][1]] === 1) {
                continue;
            }
            // Step 3c: Mark visited and break the wall between
            this.#compilation[cell[1][0]][cell[1][1]] = 1;
            this.mazeGrid[cell[0][0] + cell[1][0]][cell[0][1] + cell[1][1]] = 1;
            // Step 3d: Add all walls of the newly visited cell
            addAdjacentCells(adjacentCells, this.#compilation, cell[1]);
        }
        // Step 4: Mark the end of the maze
        this.mazeGrid[2 * this.startRow][2 * this.startCol] = 2;
    }

    #ellersAlgorithm() {
        // Step 1: Initialize the maze
        let sets = []; // List to hold sets of cells for union-find structure
        this.mazeGrid[2 * this.endRow][2 * this.endCol] = 3; // Mark the start cell
        const total_row = 2 * this.height - 1;
        const total_col = 2 * this.width - 1;
        const probability = 0.5;

        // Step 2: Process each subsequent row
        for (let row = 0; row < total_row; row+=2) {
            // Step 2a: Create a new set for each cell in the current row
            for (let col = 0; col < total_col; col+=2) {
                const set = { cells: [[row, col]], id: row * this.mazeGrid[0].length + col }; // New set for the cell
                sets.push(set);
            }

            // Step 2b: Connect cells within the current row
            for (let col = 2; col < total_col; col+=2) {
                if (Math.random() < probability) { // Randomly decide whether to connect to the left
                    union(sets, row, col, row, col - 2);
                    this.mazeGrid[row][col - 1] = 1;
                }
            }

            // Step 2c: Connect cells to the row above
            if (row > 0) {
                let order = [];
                for (let col = 0; col <  this.mazeGrid[0].length; col+=2) {
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
                        this.mazeGrid[row - 1][col] = 1;
                    }
                }
            }
        }

        // Step 3: Mark the end of the maze
        this.mazeGrid[2 * this.startRow][2 * this.startCol] = 2; // Mark the end cell
    }
    // 00 --> 00-02
    // 01 --> 03
    // 02 --> 04-06
    // 03 --> 07
    #scale() {
        // console.log("visualize = ", this.grid);
        this.mazeMap = new Array(this.height - 1 + this.height * this.cellSize)
        for (let row=0; row<this.mazeMap.length; row++) {
            this.mazeMap[row] = new Array(this.width - 1 + this.width * this.cellSize).fill(1);
            for (let col=0; col<this.mazeMap[0].length; col++) {
                if ((row-this.cellSize) % (this.cellSize + 1) === 0 || (col-this.cellSize) % (this.cellSize + 1) === 0) {
                    this.mazeMap[row][col] = 0;
                }
            }
        }
        // console.log("visualizeMaze.size = ", this.visualizeMaze.length, this.visualizeMaze[0].length);
        // 1-->3, 3-->7, 5-->11
        // ceil(col/2) * cellSize + floor(col/2)
        // 0-->1, 2-->5, 4-->9
        // row/2 * (cellSize + 1) + floor(cellSize/2)
        let cellMiddle = Math.floor(this.cellSize/2)
        for (let row=0; row<this.mazeGrid.length; row+=2) {
            for (let col=1; col<this.mazeGrid[0].length; col+=2) {
                if (this.mazeGrid[row][col] === 1) {
                    let visualRow = row/2 * (this.cellSize + 1) + Math.floor(this.cellSize/2);
                    let visualCol = Math.ceil(col/2) * this.cellSize + Math.floor(col/2);
                    for (let i=visualRow-cellMiddle; i<=visualRow+cellMiddle; i++) {
                        this.mazeMap[i][visualCol] = 1;
                    }
                }
            }
        }
        for (let col=0; col<this.mazeGrid[0].length; col+=2) {
            for (let row=1; row<this.mazeGrid.length; row+=2) {
                if (this.mazeGrid[row][col] === 1) {
                    let visualRow = Math.ceil(row/2) * this.cellSize + Math.floor(row/2);
                    let visualCol = col/2 * (this.cellSize + 1) + Math.floor(this.cellSize/2);
                    for (let i=visualCol-cellMiddle; i<=visualCol+cellMiddle; i++) {
                        this.mazeMap[visualRow][i] = 1;
                    }
                }
            }
        }

        // 0 --> 0, 1 --> 2, 2 --> 4
        let [startX, startY] = this.convertToMap(this.startCol, this.startRow);
        this.mazeMap[startY][startX] = 3;
        let [endX, endY] = this.convertToMap(this.endCol, this.endRow);
        this.mazeMap[endY][endX] = 2;
        return;
    }
    // Get the middle coordinate of the cell at x, y
    convertToMap(x, y) {    // maze --> map
        let cellMiddle = Math.floor(this.cellSize/2);
        return [x * (this.cellSize + 1) + cellMiddle, y * (this.cellSize + 1) + cellMiddle];
    }
    getStartOfMap() {
        return this.convertToMap(this.startCol, this.startRow)
    }
    getMiddleOfMap() {
        return [this.mazeMap[0].length/2, this.mazeMap.length/2];
    }
    getWinOfMap() {
        return this.convertToMap(this.endCol, this.endRow)
    }
}

export default Maze;