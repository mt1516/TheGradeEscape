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

function addAdjacentCells(adjacentCells, compilationMaze, cell) {
    const unvisitedNighbors = getUnvisitedNighbors(compilationMaze, cell[0], cell[1]);
    for (let [row, col] of unvisitedNighbors) {
        adjacentCells.push([[cell[0], cell[1]], [row, col]]);
    }
}

function union(sets, row1, col1, row2, col2) {
    const set1 = find(sets, row1, col1);
    const set2 = find(sets, row2, col2);

    if (set1 < 0 || set2 < 0) {
        return; // Invalid set
    }

    if (set1 !== set2) {
        // Merge two sets
        sets[set2].cells.forEach(cell => {
            sets[set1].cells.push(cell);
        });
        sets.splice(set2, 1); // Remove the merged set
    }
}

function find(sets, row, col) {
    for (let i = 0; i < sets.length; i++) {
        if (sets[i].cells.some(cell => cell[0] === row && cell[1] === col)) {
            return i; // Return the index of the set containing the cell
        }
    }
    return -1; // Not found
}

export {
    initMaze,
    getUnvisitedNighbors,
    addAdjacentCells,
    union,
    find,
}