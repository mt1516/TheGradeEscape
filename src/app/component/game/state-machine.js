const STATE = Object.freeze({
    IDLE: 0,
    MOVE: 1,
    WIN: 2,
    DEAD: 3,            // TODO: Implement this state
});

const DIRECTION = Object.freeze({
    IDLE: 0,
    UP: 1,
    RIGHT: 2,
    DOWN: 3,
    LEFT: 4,
});

class stateMachine {
    #mazeMap
    #state
    #characterSize
    #hitboxWidth                // height has no use in a 2.5D game
    #speed
    #direction
    #currentHitboxCoordinate;   // the center of the hitbox
    #currentRenderCoordinate;
    #endCoordinate
    constructor(characterSize, hitboxWidth, startCoord, endCoord, mazeMap) {
        this.#state = STATE.IDLE;
        this.#direction = DIRECTION.IDLE;
        this.#characterSize = characterSize;
        this.#hitboxWidth = hitboxWidth;
        this.#speed = 1;
        // Simple box collision model
        this.#currentHitboxCoordinate = startCoord;
        this.#currentRenderCoordinate = [].concat(this.#currentHitboxCoordinate);
        this.#currentRenderCoordinate[1] = this.#currentRenderCoordinate[1] + Math.floor(this.#characterSize[1] / 2);
        this.#endCoordinate = endCoord;
        this.#mazeMap = mazeMap;
        // console.log("this.#currentRenderCoordinate = ", this.#currentRenderCoordinate);
        // console.log("this.#currentHitboxCoordinate = ", this.#currentHitboxCoordinate);
    }

    reset() {
        this.#state = STATE.IDLE;
        this.#direction = DIRECTION.IDLE;
    }

    update() {
        this.checkWin();
        if (this.isMove()) {
            return this.#move();
        }
        // console.log("this.#state = ", this.#state);
        // switch (this.#state) {
        //     case (STATE.MOVE):
        //         return this.#move();
        // }
        return this.#currentRenderCoordinate;
    }

    getDirection() {
        return this.#direction
    }

    checkWin() {
        if (this.#currentHitboxCoordinate[0] === this.#endCoordinate[0] && this.#currentHitboxCoordinate[1] === this.#endCoordinate[1]) {
            // console.log("win");
            this.#state = STATE.WIN;
            // console.log("this.#currentCoordinate = ", this.#currentCoordinate);
        }
    }

    isMove() {
        return (this.#state === STATE.MOVE);
    }

    isWin() {
        return (this.#state === STATE.WIN);
    }

    left() {
        if (this.#state === STATE.WIN) {
            return;
        }
        this.#state = STATE.MOVE;
        this.#direction = DIRECTION.LEFT;
    }

    right() {
        if (this.#state === STATE.WIN) {
            return;
        }
        this.#state = STATE.MOVE;
        this.#direction = DIRECTION.RIGHT;
    }

    up() {
        if (this.#state === STATE.WIN) {
            return;
        }
        this.#state = STATE.MOVE;
        this.#direction = DIRECTION.UP;
    }

    down() {
        if (this.#state === STATE.WIN) {
            return;
        }
        this.#state = STATE.MOVE;
        this.#direction = DIRECTION.DOWN;
    }

    stop() {
        if (this.#state === STATE.MOVE) {
            this.#state = STATE.IDLE;
            this.#direction = DIRECTION.IDLE;
        }
    }

    #move() {
        let [hitboxCoordinate, renderCoordinate] = this.#getNextCoordinate()
        // console.log("hitboxCoordinate, renderCoordinate = ", hitboxCoordinate, renderCoordinate)
        if (this.#isValidMove(hitboxCoordinate)) {
            this.#currentHitboxCoordinate = hitboxCoordinate;
            this.#currentRenderCoordinate = renderCoordinate;
            return renderCoordinate;
        }
        return this.#currentRenderCoordinate
    }

    #getNextCoordinate() {
        switch (this.#direction) {
            case DIRECTION.UP:
                return [
                    [this.#currentHitboxCoordinate[0], this.#currentHitboxCoordinate[1] + this.#speed], 
                    [this.#currentRenderCoordinate[0], this.#currentRenderCoordinate[1] + this.#speed]
                ]
            case DIRECTION.RIGHT:
                return [
                    [this.#currentHitboxCoordinate[0] + this.#speed, this.#currentHitboxCoordinate[1]], 
                    [this.#currentRenderCoordinate[0] + this.#speed, this.#currentRenderCoordinate[1]]
                ]
            case DIRECTION.DOWN:
                return [
                    [this.#currentHitboxCoordinate[0], this.#currentHitboxCoordinate[1] - this.#speed], 
                    [this.#currentRenderCoordinate[0], this.#currentRenderCoordinate[1] - this.#speed]
                ]
            case DIRECTION.LEFT:
                return [
                    [this.#currentHitboxCoordinate[0] - this.#speed, this.#currentHitboxCoordinate[1]], 
                    [this.#currentRenderCoordinate[0] - this.#speed, this.#currentRenderCoordinate[1]]
                ]
        }
        return [-1, -1]
    }
    
    #isValidMove(hitboxCoordinate) {
        let halfHitbox = Math.floor(this.#hitboxWidth/2);
        let left = hitboxCoordinate[0] - halfHitbox;
        let right = hitboxCoordinate[0] + halfHitbox;
        if (!this.#inBound(left, right, hitboxCoordinate[1])) {
            return false;
        }
        for (let x = left; x <= right; x++) {
            if (!this.#isValidPath(x, hitboxCoordinate[1])) {
                return false;
            }
        }
        return true;
    }

    #inBound(leftX, rightX, y) {
        return (
            leftX >= 0 &&
            y >= 0 &&
            rightX < this.#mazeMap[0].length &&
            y < this.#mazeMap.length
        )
    }
    
    #isValidPath(x, y) {
        return this.#mazeMap[y][x] !== 0;
    }
}

export default stateMachine;