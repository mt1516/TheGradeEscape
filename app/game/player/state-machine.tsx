"use client";

import { MAZECELL } from '../maze-generator';
import { Mode } from '../game'

enum STATE {
    IDLE = 0,
    MOVE,
    WIN,
    DEAD,
};

enum DIRECTION {
    IDLE = 0,
    UP,
    RIGHT,
    DOWN,
    LEFT,
}

// TODO: Add pump wall detection explicitly
// TODO: Add health system
export default class StateMachine {
    private state: STATE;
    private direction: DIRECTION;
    private health: number;
    private gamemode: Mode;
    private mazeMap: number[][];
    private characterSize: number[];
    private hitboxWidth: number;
    private speed: number;
    private currentHitboxCoordinate: number[];
    private currentRenderCoordinate: number[];
    private endCoordinate: number[];
    constructor(gamemode: Mode, mazeMap: number[][], characterSize: number[], hitboxWidth: number, currentHitboxCoordinate: number[], endCoordinate: number[]) {
        this.state = STATE.IDLE;
        this.direction = DIRECTION.IDLE;
        this.health = 3;
        this.gamemode = gamemode;
        this.mazeMap = mazeMap;
        this.characterSize = characterSize;
        this.hitboxWidth = hitboxWidth;
        this.speed = 1;
        this.currentHitboxCoordinate = currentHitboxCoordinate;
        this.currentRenderCoordinate = [currentHitboxCoordinate[0], currentHitboxCoordinate[1] + Math.floor(this.characterSize[1] / 2)];
        this.endCoordinate = endCoordinate;
    }
    public reset() {
        this.state = STATE.IDLE;
        this.direction = DIRECTION.IDLE;
    }

    public update(): [number[], boolean] {
        this.checkWin();
        // if (this.state === STATE.MOVE) {
        //     return this.move();
        // }
        return this.move()
    }

    public getDirection() {
        return this.direction;
    }

    public checkWin() {
        if (this.currentHitboxCoordinate[0] === this.endCoordinate[0] && this.currentHitboxCoordinate[1] === this.endCoordinate[1]) {
            this.state = STATE.WIN;
        }
    }
    public isMove() {
        return (this.state === STATE.MOVE);
    }

    public isWin() {
        return (this.state === STATE.WIN);
    }

    public left() {
        if (this.state >= STATE.WIN) {
            // console.log(`state = ${this.state}`)
            return;
        }
        this.state = STATE.MOVE;
        this.direction = DIRECTION.LEFT;
    }

    public right() {
        if (this.state >= STATE.WIN) {
            // console.log(`state = ${this.state}`)
            return;
        }
        this.state = STATE.MOVE;
        this.direction = DIRECTION.RIGHT;
    }

    public up() {
        if (this.state >= STATE.WIN) {
            // console.log(`state = ${this.state}`)
            return;
        }
        this.state = STATE.MOVE;
        this.direction = DIRECTION.UP;
    }

    public down() {
        if (this.state >= STATE.WIN) {
            // console.log(`state = ${this.state}`)
            return;
        }
        this.state = STATE.MOVE;
        this.direction = DIRECTION.DOWN;
    }

    public stop() {
        if (this.state === STATE.MOVE) {
            this.state = STATE.IDLE;
            this.direction = DIRECTION.IDLE;
        }
    }

    private move(): [number[], boolean] {
        // NO NEED --> player.tsx already checked move
        // if (this.state === STATE.MOVE) {
        let [hitboxCoordinate, renderCoordinate] = this.getNextCoordinate()
        var pumpWallFlag = false;
        if (this.isValidMove(hitboxCoordinate)) {
            // console.log("hitboxCoordinate, renderCoordinate = ", hitboxCoordinate, renderCoordinate)
            this.currentHitboxCoordinate = hitboxCoordinate;
            this.currentRenderCoordinate = renderCoordinate;
            return [renderCoordinate, pumpWallFlag];
        } else {
            pumpWallFlag = this.pumpWallCheck();
        }
        // }
        return [this.currentRenderCoordinate, pumpWallFlag];
    }

    private pumpWallCheck(): boolean {
        if (this.gamemode !== 'DBTW') {
            return false;
        }
        this.health -= 1;
        console.log(`health = ${this.health}`)
        this.stop();
        if (this.health === 0) {
            this.state = STATE.DEAD
        }
        return true;
    }

    private getNextCoordinate(): [number[], number[]] {
        switch (this.direction) {
            case DIRECTION.UP:
                return [
                    [this.currentHitboxCoordinate[0], this.currentHitboxCoordinate[1] + this.speed],
                    [this.currentRenderCoordinate[0], this.currentRenderCoordinate[1] + this.speed]
                ]
            case DIRECTION.RIGHT:
                return [
                    [this.currentHitboxCoordinate[0] + this.speed, this.currentHitboxCoordinate[1]],
                    [this.currentRenderCoordinate[0] + this.speed, this.currentRenderCoordinate[1]]
                ]
            case DIRECTION.DOWN:
                return [
                    [this.currentHitboxCoordinate[0], this.currentHitboxCoordinate[1] - this.speed],
                    [this.currentRenderCoordinate[0], this.currentRenderCoordinate[1] - this.speed]
                ]
            case DIRECTION.LEFT:
                return [
                    [this.currentHitboxCoordinate[0] - this.speed, this.currentHitboxCoordinate[1]],
                    [this.currentRenderCoordinate[0] - this.speed, this.currentRenderCoordinate[1]]
                ]
        }
        return [
            [-1, -1],
            [-1, -1],
        ]
    }

    private isValidMove(hitboxCoordinate: number[]): boolean {
        let halfHitbox = Math.floor(this.hitboxWidth / 2);
        let left = hitboxCoordinate[0] - halfHitbox;
        let right = hitboxCoordinate[0] + halfHitbox;
        if (!this.inBound(left, right, hitboxCoordinate[1])) {
            return false;
        }
        for (let x = left; x <= right; x++) {
            if (!this.isValidPath(x, hitboxCoordinate[1])) {
                return false;
            }
        }
        return true;
    }

    private inBound(leftX: number, rightX: number, y: number): boolean {
        return (
            leftX >= 0 &&
            y >= 0 &&
            rightX < this.mazeMap[0].length &&
            y < this.mazeMap.length
        )
    }

    private isValidPath(x: number, y: number): boolean {
        return this.mazeMap[y][x] !== MAZECELL.WALL;
    }
}