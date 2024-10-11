const {primsAlgorithm, addAdjacentCells} = require('../../src/maze-generator/prims-algorithm').default;

describe('Maze Generator Tests', () => {
    test('primsAlgorithm test case 1', () => {
        const width = 3;
        const height = 3;
        const startRow = 0;
        const startCol = 0;
        const endRow = 2;
        const endCol = 2;
        const mazeGenerated = primsAlgorithm(width, height, startRow, startCol, endRow, endCol);
        expect(mazeGenerated.length).toEqual(2*height-1);
        for (let i=0; i<mazeGenerated.length; i++) {
            expect(mazeGenerated[i].length).toEqual(2*width-1);
        }
        expect(mazeGenerated[2*startRow][2*startCol]).toEqual(2);
        expect(mazeGenerated[2*endRow][2*endCol]).toEqual(3);
        console.log(mazeGenerated);
    });
    test('addAdjacentCells test case 1', () => {
        const maze = [
            [2, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ];
        var adjacentCells = [];
        const row = 1;
        const col = 1;
        addAdjacentCells(adjacentCells, maze, [row, col]);

        expect(adjacentCells).toEqual(expect.arrayContaining([
            [[row, col], [row-1, col]],
            [[row, col], [row+1, col]],
            [[row, col], [row, col-1]],
            [[row, col], [row, col+1]]
        ]));
        expect(adjacentCells.length).toEqual(4);
    });
    test('addAdjacentCells test case 2', () => {
        const maze = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ];
        var adjacentCells = [];
        const row = 1;
        const col = 0;
        addAdjacentCells(adjacentCells, maze, [row, col]);

        expect(adjacentCells).toEqual(expect.arrayContaining([
            [[row, col], [row-1, col]],
            [[row, col], [row+1, col]],
            [[row, col], [row, col+1]]
        ]));
        expect(adjacentCells.length).toEqual(3);
    });
    test('addAdjacentCells test case 3', () => {
        const maze = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ];
        var adjacentCells = [];
        const row = 1;
        const col = 2;
        addAdjacentCells(adjacentCells, maze, [row, col]);

        expect(adjacentCells).toEqual(expect.arrayContaining([
            [[row, col], [row-1, col]],
            [[row, col], [row+1, col]],
            [[row, col], [row, col-1]]
        ]));
        expect(adjacentCells.length).toEqual(3);
    });
    test('addAdjacentCells test case 4', () => {
        const maze = [
            [2, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ];
        var adjacentCells = [];
        const row = 1;
        const col = 0;
        addAdjacentCells(adjacentCells, maze, [row, col]);

        expect(adjacentCells).toEqual(expect.arrayContaining([
            [[row, col], [row+1, col]],
            [[row, col], [row, col+1]]
        ]));
        expect(adjacentCells.length).toEqual(2);
    });
});