const {initMaze, getUnvisitedNighbors, recursiveBacktracing} = require('./maze-generator');

describe('Maze Generator Tests', () => {
    test('recursiveBacktracking test case 1', () => {
        const mazeGenerated = recursiveBacktracing(3, 3, 0, 0, 2, 2);
        expect(mazeGenerated.length).toEqual(5);
        for (let i=0; i<5; i++) {
            expect(mazeGenerated[i].length).toEqual(5);
        }
        expect(mazeGenerated[0][0]).toEqual(2);
        expect(mazeGenerated[4][4]).toEqual(3);

    });
    test('initMaze test case 1', () => {
        expect(initMaze(3, 3)).toEqual({
            visualizeMaze: [
                [1, 0, 1, 0, 1],
                [0, 0, 0, 0, 0],
                [1, 0, 1, 0, 1],
                [0, 0, 0, 0, 0],
                [1, 0, 1, 0, 1]
            ],
            compilationMaze: [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]
            ]
        });
    });
    test('getUnvisitedNighbors test case 1', () => {
        const maze = [
            [2, 0, 0, 0, 0],
            [0, 0, 0, 1, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 1, 0],
            [0, 0, 0, 0, 0]
        ];
        const row = 1;
        const col = 1;
        const neighbors = getUnvisitedNighbors(row, col, 5, 5, maze);

        expect(neighbors).toEqual(expect.arrayContaining([[0, 1], [2, 1], [1, 0], [1, 2]]));
        expect(neighbors.length).toEqual(4);
    });
    test('getUnvisitedNighbors test case 2', () => {
        const maze = [
            [2, 0, 0, 0, 0],
            [0, 0, 0, 1, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 1, 0],
            [0, 0, 0, 0, 0]
        ];
        const row = 1;
        const col = 0;
        const neighbors = getUnvisitedNighbors(row, col, 5, 5, maze);

        expect(neighbors).toEqual(expect.arrayContaining([[1, 1], [2, 0]]));
        expect(neighbors.length).toEqual(2);
    });
    test('getUnvisitedNighbors test case 3', () => {
        const maze = [
            [2, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 1, 0],
            [0, 0, 0, 0, 0]
        ];
        const row = 1;
        const col = 4;
        const neighbors = getUnvisitedNighbors(row, col, 5, 5, maze);

        expect(neighbors).toEqual(expect.arrayContaining([[0, 4], [2, 4], [1, 3]]));
        expect(neighbors.length).toEqual(3);
    });
    test('getUnvisitedNighbors test case 4', () => {
        const maze = [
            [2, 0, 0, 0, 0],
            [0, 0, 0, 1, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 1, 0],
            [0, 0, 0, 0, 0]
        ];
        const row = 1;
        const col = 4;
        const neighbors = getUnvisitedNighbors(row, col, 5, 5, maze);

        expect(neighbors).toEqual(expect.arrayContaining([[0, 4], [2, 4]]));
        expect(neighbors.length).toEqual(2);
    });
});