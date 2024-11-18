import { setting } from './game'

export enum MAZECELL {
    WALL = 0,
    PATH,
    WIN,
    START,
}

export default class Maze {
    public mazeMap: number[][];
    private compilation: number[][];
    private mazeGrid: number[][];
    private width: number;
    private height: number;
    private startRow: number;
    private startCol: number;
    private endRow: number;
    private endCol: number;
    private complexity: number;
    private cellSize: number;
    constructor(s: setting) {
        this.width = s.width;
        this.height = s.height;
        this.startRow = s.startRow;
        this.startCol = s.startCol;
        this.endRow = s.endRow;
        this.endCol = s.endCol;
        this.complexity = s.complexity;
        this.cellSize = s.cellSize;
        this.compilation = []
        if (this.complexity !== 1) {    // skip for eller's algorithm as it doesn't need this array
            this.compilation = new Array(this.height).fill(0).map(() => new Array(this.width).fill(MAZECELL.WALL));
        }
        this.mazeGrid = this.initGrid();
        this.mazeMap = this.initMap();
        this.generateMaze();
    }

    // Get the middle coordinate of the cell at x, y
    public convertToMap(x: number, y: number) {    // maze --> map
        let cellMiddle = Math.floor(this.cellSize/2);
        return [x * (this.cellSize + 1) + cellMiddle, y * (this.cellSize + 1) + cellMiddle];
    }
    public getStartOfMap() {
        return this.convertToMap(this.startCol, this.startRow)
    }
    public getMiddleOfMap() {
        return [this.mazeMap[0].length/2, this.mazeMap.length/2];
    }
    public getWinOfMap() {
        return this.convertToMap(this.endCol, this.endRow)
    }

    public getLengthOfSolution() {
        return this.aStarSearch().length;
    }

    private initGrid(): number[][] {
        var mazeGrid = new Array(2 * this.height - 1);
        for (let i=0; i<2*this.height-1; i++) {
            mazeGrid[i] = new Array(2 * this.width - 1).fill(MAZECELL.WALL);
            for (let j=0; j<2*this.width-1; j++) {
                if (i % 2 === 0 && j % 2 === 0) {
                    mazeGrid[i][j] = MAZECELL.PATH;
                }
            }
        }
        return mazeGrid;
    }

    private initMap(): number[][] {
        var mazeMap = new Array(this.height - 1 + this.height * this.cellSize)
        for (let row=0; row<mazeMap.length; row++) {
            mazeMap[row] = new Array(this.width - 1 + this.width * this.cellSize).fill(MAZECELL.PATH);
            for (let col=0; col<mazeMap[0].length; col++) {
                if ((row-this.cellSize) % (this.cellSize + 1) === 0 || (col-this.cellSize) % (this.cellSize + 1) === 0) {
                    mazeMap[row][col] = MAZECELL.WALL;
                }
            }
        }
        return mazeMap;
    }

    private generateMaze() {
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
        this.scale();
    }

    private recursiveBacktracing() {
        // Step 1: Initialize the maze
        this.compilation[this.endRow][this.endCol] = MAZECELL.PATH; // Mark the start cell
        this.mazeGrid[2*this.endRow][2*this.endCol] = MAZECELL.START; // Mark the start cell

        // Step 2: Push the starting cell
        const stack = [] // Stack to hold cells, which can be pop out to be searched later
        stack.push([this.endRow, this.endCol]);

        // Step 3: Start recursion
        while (stack.length>0) {
            // Step 3a: Pop the last cell out
            const cell: number[] = stack.pop() as number[];
            // Step 3b: Get all the unvisited neighbours of the current cell
            const neighbors = this.getNighbors(cell);
            // Step 3c: Check if there is any cell not visited, if yes, the path havent reach a dead end, which can be continue to search deeper
            if (neighbors.length > 0) {
                // Step 3d: Push back from backtracing
                stack.push(cell);
                // Step 3e: Random choose one for searching 
                const chosenNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
                this.compilation[chosenNeighbor[0]][chosenNeighbor[1]] = MAZECELL.PATH;
                this.mazeGrid[cell[0] + chosenNeighbor[0]][cell[1] + chosenNeighbor[1]] = MAZECELL.PATH;
                // Step 3f: Push back for next iteration
                stack.push(chosenNeighbor)
            }
        }
        // Step 4: Mark the end of the maze
        this.mazeGrid[2*this.startRow][2*this.startCol] = MAZECELL.WIN;
    }

    private primsAlgorithm() {
        // Step 1: Initialize the maze
        this.compilation[this.endRow][this.endCol] = MAZECELL.PATH; // Mark the start cell
        this.mazeGrid[2*this.endRow][2*this.endCol] = MAZECELL.START; // Mark the start cell

        let adjacentCells: any[] = []; // List to hold 2 cells, which shows the wall
        // Step 2: Push all walls of the starting cell
        this.addAdjacentCells(adjacentCells, [this.endRow, this.endCol]);
        // Step 3: Start recursion
        while (adjacentCells.length > 0) {
            // Step 3a: Randomly choose one wall out and remove it from the list
            const cell = adjacentCells[Math.floor(Math.random() * adjacentCells.length)];
            adjacentCells = adjacentCells.filter(c => c !== cell);
            // Step 3b: Skip if the cell is already visited
            if (this.compilation[cell[1][0]][cell[1][1]] === MAZECELL.PATH) {
                continue;
            }
            // Step 3c: Mark visited and break the wall between
            this.compilation[cell[1][0]][cell[1][1]] = MAZECELL.PATH;
            this.mazeGrid[cell[0][0] + cell[1][0]][cell[0][1] + cell[1][1]] = MAZECELL.PATH;
            // Step 3d: Add all walls of the newly visited cell
            this.addAdjacentCells(adjacentCells, cell[1]);
        }
        // Step 4: Mark the end of the maze
        this.mazeGrid[2 * this.startRow][2 * this.startCol] = MAZECELL.WIN;
    }

    private ellersAlgorithm() {
        // Step 1: Initialize the maze
        let sets = []; // List to hold sets of cells for union-find structure
        this.mazeGrid[2 * this.endRow][2 * this.endCol] = MAZECELL.START; // Mark the start cell
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
                    this.union(sets, [row, col], [row, col - 2]);
                    this.mazeGrid[row][col - 1] = MAZECELL.PATH;
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
                    if (this.find(sets, [row, col]) !== this.find(sets, [row - 2, col])) {
                        this.union(sets, [row, col], [row - 2, col]);
                        this.mazeGrid[row - 1][col] = MAZECELL.PATH;
                    }
                }
            }
        }

        // Step 3: Mark the end of the maze
        this.mazeGrid[2 * this.startRow][2 * this.startCol] = MAZECELL.WIN; // Mark the end cell
    }
    private scale() {
        // 00 --> 00-02
        // 01 --> 03
        // 02 --> 04-06
        // 03 --> 07
        // 1-->3, 3-->7, 5-->11
        // ceil(col/2) * cellSize + floor(col/2)
        // 0-->1, 2-->5, 4-->9
        // row/2 * (cellSize + 1) + floor(cellSize/2)
        let cellMiddle = Math.floor(this.cellSize/2)
        for (let row=0; row<this.mazeGrid.length; row+=2) {
            for (let col=1; col<this.mazeGrid[0].length; col+=2) {
                if (this.mazeGrid[row][col] === MAZECELL.PATH) {
                    let visualRow = row/2 * (this.cellSize + 1) + Math.floor(this.cellSize/2);
                    let visualCol = Math.ceil(col/2) * this.cellSize + Math.floor(col/2);
                    for (let i=visualRow-cellMiddle; i<=visualRow+cellMiddle; i++) {
                        this.mazeMap[i][visualCol] = MAZECELL.PATH;
                    }
                }
            }
        }
        for (let col=0; col<this.mazeGrid[0].length; col+=2) {
            for (let row=1; row<this.mazeGrid.length; row+=2) {
                if (this.mazeGrid[row][col] === MAZECELL.PATH) {
                    let visualRow = Math.ceil(row/2) * this.cellSize + Math.floor(row/2);
                    let visualCol = col/2 * (this.cellSize + 1) + Math.floor(this.cellSize/2);
                    for (let i=visualCol-cellMiddle; i<=visualCol+cellMiddle; i++) {
                        this.mazeMap[visualRow][i] = MAZECELL.PATH;
                    }
                }
            }
        }

        // 0 --> 0, 1 --> 2, 2 --> 4
        let [startX, startY] = this.convertToMap(this.startCol, this.startRow);
        this.mazeMap[startY][startX] = MAZECELL.START;
        let [endX, endY] = this.convertToMap(this.endCol, this.endRow);
        this.mazeMap[endY][endX] = MAZECELL.WIN;
        return;
    }

    // isMap is a flag to switch this function on different usage
    // isMap = true: support A-star search
    // isMap = false: support maze generation
    private getNighbors(cell: number[], isMap: boolean = false) {
        const neighbors = [];
        const direction = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        for (let [dx, dy] of direction) {
            const newRow = dx + cell[0];
            const newCol = dy + cell[1];
            if (isMap) {
                if (newRow >= 0 && newRow < this.mazeMap.length && newCol >= 0 && newCol < this.mazeMap[0].length && 
                    this.mazeMap[newRow][newCol] !== MAZECELL.WALL) {
                    neighbors.push([newRow, newCol]);
                }
            } else {
                if (newRow >= 0 && newRow < this.height && newCol >= 0 && newCol < this.width && this.compilation[newRow][newCol] === MAZECELL.WALL) {
                    neighbors.push([newRow, newCol]);
                }
            }
        }
        return neighbors;
    }

    private addAdjacentCells(adjacentCells: any[], cell: number[]) {
        const unvisitedNighbors = this.getNighbors(cell);
        for (let [row, col] of unvisitedNighbors) {
            adjacentCells.push([[cell[0], cell[1]], [row, col]]);
        }
    }
    
    private union(sets: any[], cell1: number[], cell2: number[]) {
        const set1 = this.find(sets, cell1);
        const set2 = this.find(sets, cell2);
    
        if (set1 < 0 || set2 < 0) {
            return; // Invalid set
        }
    
        if (set1 !== set2) {
            // Merge two sets
            sets[set2].cells.forEach((c: number[]) => {
                sets[set1].cells.push(c);
            });
            sets.splice(set2, 1); // Remove the merged set
        }
    }
    
    private find(sets: any[], cell: number[]) {
        for (let i = 0; i < sets.length; i++) {
            if (sets[i].cells.some((c: number[]) => c[0] === cell[0] && c[1] === cell[1])) {
                return i; // Return the index of the set containing the cell
            }
        }
        return -1; // Not found
    }

    private aStarSearch() {
        const start = this.getStartOfMap();
        const end = this.getWinOfMap();
        const openSet = new Set<string>();
        const closedSet = new Set<string>();
        const cameFrom = new Map<string, string>();
        const gScore = new Map<string, number>();
        const fScore = new Map<string, number>();
    
        openSet.add(start.toString());
        gScore.set(start.toString(), 0);
        fScore.set(start.toString(), this.heuristic(start, end));
    
        while (openSet.size > 0) {
            let current = start;
            let currentFScore = Infinity;
            for (let cell of openSet) {
                let cellFScore = fScore.get(cell) ?? Infinity;
                if (cellFScore < currentFScore) {
                    current = cell.split(',').map(Number);
                    currentFScore = cellFScore;
                }
            }
    
            if (current.toString() === end.toString()) {
                return this.reconstructPath(cameFrom, current);
            }
    
            openSet.delete(current.toString());
            closedSet.add(current.toString());
    
            let neighbors = this.getNighbors(current, true);
            for (let neighbor of neighbors) {
                if (closedSet.has(neighbor.toString())) {
                    continue;
                }
    
                let tentativeGScore = (gScore.get(current.toString()) ?? Infinity) + 1;
                if (!openSet.has(neighbor.toString())) {
                    openSet.add(neighbor.toString());
                } else if (tentativeGScore >= (gScore.get(neighbor.toString()) ?? Infinity)) {
                    continue;
                }
    
                cameFrom.set(neighbor.toString(), current.toString());
                gScore.set(neighbor.toString(), tentativeGScore);
                fScore.set(neighbor.toString(), tentativeGScore + this.heuristic(neighbor, end));
            }
        }
        return [];
    }

    private heuristic(cell1: number[], cell2: number[]): number {
        // Euclidean distance heuristic, tested with Manhattan distance, but there is no need in saving that computation time
        return Math.sqrt((cell1[0] - cell1[0]) ** 2 + (cell1[1] - cell2[1]) ** 2);
    }

    private reconstructPath(cameFrom: Map<string, string>, current: number[]) {
        const path = [current];
        while (cameFrom.has(current.toString())) {
            current = cameFrom.get(current.toString())?.split(',').map(Number) ?? [];
            path.push(current);
        }
        return path.reverse();
    }
}