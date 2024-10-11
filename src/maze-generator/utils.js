module.exports = {
    initMaze,
    getUnvisitedNighbors,
};

function initMaze(width, height) {
    var visualizeMaze = new Array(2 * height - 1);
    var maze = new Array(height).fill(0).map(() => new Array(width).fill(0));
    for (let i=0; i<2*height-1; i++) {
        visualizeMaze[i] = new Array(2 * width - 1).fill(0);
        for (let j=0; j<2*width-1; j++) {
            if (i % 2 === 0 && j % 2 === 0) {
                visualizeMaze[i][j] = 1;
            }
        }
    }
    return {
        visualizeMaze: visualizeMaze,
        compilationMaze: maze
    }
}


function getUnvisitedNighbors(comilationMaze, row, col){
    const neighbors = [];
    const direction = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    for (let [dx, dy] of direction) {
        const newRow = dx + row;
        const newCol = dy + col;
        if (newRow >= 0 && newRow < comilationMaze.length && newCol >= 0 && newCol < comilationMaze[0].length && comilationMaze[newRow][newCol] === 0) {
            neighbors.push([newRow, newCol]);
        }
    }
    return neighbors;
}