"use client";

enum STATE {
    IDLE = 0,
    MOVE, 
    WIN, 
    DEAR,
};

enum DIRECTION {
    IDLE = 0,
    UP,
    RIGHT,
    DOWN,
    LEFT,
}

export default class StateMachine {
    private state: STATE;
    private direction: DIRECTION;
    private mazeMap: number[][];
    private characterSize: number[];
    private hitboxWidth: number;
    private speed: number;
    private currentHitboxCoordinate: number[];
    private currentRenderCoordinate: number[];
    private endCoordinate: number[];
    constructor (mazeMap: number[][], characterSize: number[], hitboxWidth: number, currentHitboxCoordinate: number[], endCoordinate: number[]) {
        this.state = STATE.IDLE;
        this.direction = DIRECTION.IDLE;
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

    public update() {
        this.checkWin();
        if (this.state === STATE.MOVE) {
            return this.move();
        }
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
        if (this.state === STATE.WIN) {
            return;
        }
        this.state = STATE.MOVE;
        this.direction = DIRECTION.LEFT;
    }

    public right() {
        if (this.state === STATE.WIN) {
            return;
        }
        this.state = STATE.MOVE;
        this.direction = DIRECTION.RIGHT;
    }

    public up() {
        if (this.state === STATE.WIN) {
            return;
        }
        this.state = STATE.MOVE;
        this.direction = DIRECTION.UP;
    }

    public down() {
        if (this.state === STATE.WIN) {
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

    private move() {
        let [hitboxCoordinate, renderCoordinate] = this.getNextCoordinate()
        console.log("hitboxCoordinate, renderCoordinate = ", hitboxCoordinate, renderCoordinate)
        if (this.isValidMove(hitboxCoordinate)) {
            this.currentHitboxCoordinate = hitboxCoordinate;
            this.currentRenderCoordinate = renderCoordinate;
            return renderCoordinate;
        }
        return this.currentRenderCoordinate
    }

    private getNextCoordinate() {
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

    private isValidMove(hitboxCoordinate: number[]) {
        let halfHitbox = Math.floor(this.hitboxWidth/2);
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

    private inBound(leftX: number, rightX: number, y: number) {
        return (
            leftX >= 0 &&
            y >= 0 &&
            rightX < this.mazeMap[0].length &&
            y < this.mazeMap.length
        )
    }
    
    private isValidPath(x: number, y: number) {
        return this.mazeMap[y][x] !== 0;
    }
}