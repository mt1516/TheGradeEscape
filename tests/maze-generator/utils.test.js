// const { initMaze, getUnvisitedNighbors, addAdjacentCells, union, find } = require('../../src/maze-generator/utils');
import { initMaze, getUnvisitedNighbors, addAdjacentCells, union, find } from '../../src/maze-generator/utils';

describe('maze-generator utils test', () => {
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
        const neighbors = getUnvisitedNighbors(maze, row, col);

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
        const neighbors = getUnvisitedNighbors(maze, row, col);

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
        const neighbors = getUnvisitedNighbors(maze, row, col);

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
        const neighbors = getUnvisitedNighbors(maze, row, col);

        expect(neighbors).toEqual(expect.arrayContaining([[0, 4], [2, 4]]));
        expect(neighbors.length).toEqual(2);
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
    test('union test case 1', () => {
        const sets = [
            {cells: [[0, 0]], id: 0},
            {cells: [[0, 1]], id: 1},
            {cells: [[0, 2]], id: 2},
            {cells: [[0, 3]], id: 3},
            {cells: [[0, 4]], id: 4},
        ]
        union(sets, 0, 1, 0, 2);
        expect(sets).toEqual([
            {cells: [[0, 0]], id: 0},
            {cells: [[0, 1], [0, 2]], id: 1},
            {cells: [[0, 3]], id: 3},
            {cells: [[0, 4]], id: 4},
        ]);
    });
    test('union test case 2', () => {
        const sets = [
            {cells: [[0, 0]], id: 0},
            {cells: [[0, 1], [0, 2]], id: 1},
            {cells: [[0, 3]], id: 3},
            {cells: [[0, 4]], id: 4},
        ]
        union(sets, 0, 0, 0, 1);
        expect(sets).toEqual([
            {cells: [[0, 0], [0, 1], [0, 2]], id: 0},
            {cells: [[0, 3]], id: 3},
            {cells: [[0, 4]], id: 4},
        ]);
    });
    test('union test case 3', () => {
        const sets = [
            {cells: [[0, 0]], id: 0},
            {cells: [[0, 1], [0, 2]], id: 1},
            {cells: [[0, 3]], id: 3},
            {cells: [[0, 4]], id: 4},
        ]
        union(sets, 0, 0, 0, 2);
        expect(sets).toEqual([
            {cells: [[0, 0], [0, 1], [0, 2]], id: 0},
            {cells: [[0, 3]], id: 3},
            {cells: [[0, 4]], id: 4},
        ]);
    });
    test('union test case 4', () => {
        const sets = [
            {cells: [[0, 0]], id: 0},
            {cells: [[0, 1]], id: 1},
            {cells: [[0, 2]], id: 2},
            {cells: [[0, 3]], id: 3},
            {cells: [[0, 4]], id: 4},
        ]
        union(sets, 0, 0, 0, 5);
        expect(sets).toEqual([
            {cells: [[0, 0]], id: 0},
            {cells: [[0, 1]], id: 1},
            {cells: [[0, 2]], id: 2},
            {cells: [[0, 3]], id: 3},
            {cells: [[0, 4]], id: 4},
        ]);
    });
    test('union test case 5', () => {
        const sets = [
            {cells: [[0, 0]], id: 0},
            {cells: [[0, 1]], id: 1},
            {cells: [[0, 2]], id: 2},
            {cells: [[0, 3]], id: 3},
            {cells: [[0, 4]], id: 4},
        ]
        union(sets, 1, 0, 0, 0);
        expect(sets).toEqual([
            {cells: [[0, 0]], id: 0},
            {cells: [[0, 1]], id: 1},
            {cells: [[0, 2]], id: 2},
            {cells: [[0, 3]], id: 3},
            {cells: [[0, 4]], id: 4},
        ]);
    });
    test('find test case 1', () => {
        const sets = [
            {cells: [[0, 0]], id: 0},
            {cells: [[0, 1]], id: 1},
            {cells: [[0, 2]], id: 2},
            {cells: [[0, 3]], id: 3},
            {cells: [[0, 4]], id: 4},
        ];
        expect(find(sets, 0, 0)).toEqual(0);
    });
    test('find test case 2', () => {
        const sets = [
            {cells: [[0, 0]], id: 0},
            {cells: [[0, 1]], id: 1},
            {cells: [[0, 2]], id: 2},
            {cells: [[0, 3]], id: 3},
            {cells: [[0, 4]], id: 4},
        ];
        expect(find(sets, 1, 0)).toEqual(-1);
    });
});