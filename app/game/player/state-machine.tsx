"use client";

import { MAZECELL } from '../maze-generator';
import { Mode } from '../game'

let speed = 1;

enum IMMUNITY {
    VULNERABLE = 0,
    IMMUNE,
}

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

export default class StateMachine {
    private state: STATE;
    private direction: DIRECTION;
    private health: number;
    private mazeMap: number[][];
    private characterSize: number[];
    private hitboxWidth: number;
    private bumpWallFlag: boolean;
    private movedFlag: boolean
    private steps: number;
    private limitedSteps: number;
    private currentHitboxCoordinate: number[];
    private currentRenderCoordinate: number[];
    private endCoordinate: number[];
    public immunity: IMMUNITY;
    constructor(mazeMap: number[][], characterSize: number[], hitboxWidth: number, limitedSteps: number, currentHitboxCoordinate: number[], endCoordinate: number[]) {
        this.state = STATE.IDLE;
        this.direction = DIRECTION.IDLE;
        this.health = 3;
        this.mazeMap = mazeMap;
        this.characterSize = characterSize;
        this.hitboxWidth = hitboxWidth;
        this.bumpWallFlag = false;
        this.movedFlag = false;
        this.steps = 0;
        this.limitedSteps = limitedSteps;
        this.currentHitboxCoordinate = currentHitboxCoordinate;
        this.currentRenderCoordinate = [currentHitboxCoordinate[0], currentHitboxCoordinate[1] + Math.floor(this.characterSize[1] / 2)];
        this.endCoordinate = endCoordinate;
        this.immunity = IMMUNITY.VULNERABLE;
    }

    public update(): number[] {
        this.checkWin();
        return this.move()
    }

    public getDirection() {
        return this.direction;
    }

    public getHealth() {
        return this.health;
    }

    public getSteps() {
        return this.steps;
    }

    public getbumpWallFlag() {
        return this.bumpWallFlag;
    }

    public checkWin() {
        if (this.currentHitboxCoordinate[0] === this.endCoordinate[0] && this.currentHitboxCoordinate[1] === this.endCoordinate[1]) {
            this.state = STATE.WIN;
        }
    }

    public isMove() {
        return (this.state === STATE.MOVE);
    }

    public isStop() {
        return (this.state === STATE.IDLE);
    }

    public isWin() {
        return (this.state === STATE.WIN);
    }

    public isDead() {
        return (this.state === STATE.DEAD);
    }

    public left() {
        if (this.state >= STATE.WIN) {
            return;
        }
        this.state = STATE.MOVE;
        this.direction = DIRECTION.LEFT;
    }

    public right() {
        if (this.state >= STATE.WIN) {
            return;
        }
        this.state = STATE.MOVE;
        this.direction = DIRECTION.RIGHT;
    }

    public up() {
        if (this.state >= STATE.WIN) {
            return;
        }
        this.state = STATE.MOVE;
        this.direction = DIRECTION.UP;
    }

    public down() {
        if (this.state >= STATE.WIN) {
            return;
        }
        this.state = STATE.MOVE;
        this.direction = DIRECTION.DOWN;
    }

    public stop() {
        if (this.state >= STATE.WIN) {
            return;
        }
        this.state = STATE.IDLE;
        this.direction = DIRECTION.IDLE;
    }

    private move(): number[] {
        let [hitboxCoordinate, renderCoordinate] = this.getNextCoordinate()
        if (this.isValidMove(hitboxCoordinate)) {
            // console.log("valid: hitboxCoordinate, renderCoordinate = ", hitboxCoordinate, renderCoordinate)
            this.currentHitboxCoordinate = hitboxCoordinate;
            this.currentRenderCoordinate = renderCoordinate;
            this.steps += 1;
            this.movedFlag = true;
            return renderCoordinate;
        } else {
            // console.log("invalid: hitboxCoordinate, renderCoordinate = ", hitboxCoordinate, renderCoordinate)
            this.bumpWallFlag = true;
        }
        this.movedFlag = false;
        return this.currentRenderCoordinate;
    }

    public bumpWallUpdate() {
        this.bumpWallFlag = false;
        this.health -= 1;
        this.stop();
        if (this.health === 0) {
            this.state = STATE.DEAD
        }
    }
    
    public limitedStepsUpdate(): boolean {
        if (this.isMove() && this.movedFlag) {
            // this.steps += 1;
            // Avoid overflowing the opengl context
            // if (this.steps % 5 === 0) {
            return true;
            // }
        }
        if (this.steps >= this.limitedSteps) {
            this.state = STATE.DEAD;
        }
        return false;
    }

    private getNextCoordinate(): [number[], number[]] {
        switch (this.direction) {
            case DIRECTION.UP:
                return [
                    [this.currentHitboxCoordinate[0], this.currentHitboxCoordinate[1] + speed],
                    [this.currentRenderCoordinate[0], this.currentRenderCoordinate[1] + speed]
                ]
            case DIRECTION.RIGHT:
                return [
                    [this.currentHitboxCoordinate[0] + speed, this.currentHitboxCoordinate[1]],
                    [this.currentRenderCoordinate[0] + speed, this.currentRenderCoordinate[1]]
                ]
            case DIRECTION.DOWN:
                return [
                    [this.currentHitboxCoordinate[0], this.currentHitboxCoordinate[1] - speed],
                    [this.currentRenderCoordinate[0], this.currentRenderCoordinate[1] - speed]
                ]
            case DIRECTION.LEFT:
                return [
                    [this.currentHitboxCoordinate[0] - speed, this.currentHitboxCoordinate[1]],
                    [this.currentRenderCoordinate[0] - speed, this.currentRenderCoordinate[1]]
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

    public setDirection(direction: DIRECTION) {
        this.direction = direction;
    }

    public setHealth(health: number) {
        this.health = health;
    }

    public setImmunity(immune: boolean) {
        if (immune) {
            this.immunity = IMMUNITY.IMMUNE;
        } else {
            this.immunity = IMMUNITY.VULNERABLE;
        }
    }

    public isImmune(): boolean {
        return this.immunity === IMMUNITY.IMMUNE;
    }
    public hitByProjectile(): boolean {
        if (this.isImmune()) {
            return false;
        }
        this.health -= 1;
        if (this.health === 0) {
            this.state = STATE.DEAD;
            return true;
        }
        this.setImmunity(true);
        // setTimeout(() => {
        //     this.setImmunity(false);
        // }, 4000);
        return true;
    }

    public setDead() {
        this.state = STATE.DEAD;
        this.direction = DIRECTION.IDLE;
    }
}