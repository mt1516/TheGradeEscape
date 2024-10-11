module.exports = {
    getMaze,
    initMaze,
    recursiveBacktracing,
    getUnvisitedNighbors
};

function getMaze(width, height) {
    console.log("Generating maze with width: " + width + " and height: " + height);
    const visualizeMaze = recursiveBacktracing(width, height, 0, 0)
    console.log(visualizeMaze);
}

function recursiveBacktracing(width, height, startRow, startCol, endRow, endCol) {
    var maze = initMaze(width, height);
    maze.compilationMaze[startRow][startCol] = 1;
    maze.visualizeMaze[startRow][startCol] = 2;
    const stack = []
    stack.push([startRow, startCol]);
    while (stack.length>0) {
        const [row, col] = stack.pop();
        const neighbors = getUnvisitedNighbors(row, col, height, width, maze.compilationMaze);
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

function initMaze(width, height) {
    var visualizeMaze = new Array(2 * height - 1);
    var maze = new Array(height).fill(0).map(() => new Array(width).fill(0));
    for (let i=0; i<2*height-1; i++) {
        visualizeMaze[i] = new Array(2 * width - 1);
        for (let j=0; j<2*width-1; j++) {
            if (i % 2 === 0 && j % 2 === 0) {
                visualizeMaze[i][j] = 1;
            } else {
                visualizeMaze[i][j] = 0;
            }
        }
    }
    return {
        visualizeMaze: visualizeMaze,
        compilationMaze: maze
    }
}

function getUnvisitedNighbors(row, col, width, height, maze) {
    const neighbors = [];
    const direction = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    for (let [dx, dy] of direction) {
        const newRow = Number(row) + dx;
        const newCol = Number(col) + dy;
        if (newRow >= 0 && newRow < height && newCol >= 0 && newCol < width && maze[newRow][newCol] === 0) {
            neighbors.push([newRow, newCol]);
        }
    }
    return neighbors;
}

    // -----------------
    // | 1 0 1 0 1 0 1 |
    // | 0 0 0 0 0 0 0 |
    // | 1 0 1 0 1 0 1 |
    // | 0 0 0 0 0 0 0 |
    // | 1 0 1 0 1 0 1 |
    // | 0 0 0 0 0 0 0 |
    // | 1 0 1 0 1 0 1 |
    // -----------------
