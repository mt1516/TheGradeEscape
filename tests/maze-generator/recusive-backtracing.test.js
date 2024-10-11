const {recursiveBacktracing} = require('../../src/maze-generator/recursive-backtracing').default;

describe('Maze Generator Tests', () => {
    test('recursiveBacktracking test case 1', () => {
        const width = 3;
        const height = 3;
        const startRow = 0;
        const startCol = 0;
        const endRow = 2;
        const endCol = 2;
        const mazeGenerated = recursiveBacktracing(width, height, startRow, startCol, endRow, endCol);
        expect(mazeGenerated.length).toEqual(2*height-1);
        for (let i=0; i<mazeGenerated.length; i++) {
            expect(mazeGenerated[i].length).toEqual(2*width-1);
        }
        expect(mazeGenerated[2*startRow][2*startCol]).toEqual(2);
        expect(mazeGenerated[2*endRow][2*endCol]).toEqual(3);
        console.log(mazeGenerated);
    });
});