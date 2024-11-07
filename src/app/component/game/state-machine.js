const STATE = Object.freeze({
    IDLE: 0,
    // ACCEREATE: 1,    // TODO: Implement this state
    MOVE: 1,
    // BRAKE: 3,        // TODO: Implement this state
    DEAD: 2,            // TODO: Implement this state
    WIN: 3,
    END: 4,
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
    #hitboxSize   // [width, height]
    #speed
    #direction
    #currentHitboxCoordinate;
    #currentRenderCoordinate;
    #endCoordinate
    #hitboxWall     // [[top], [right], [bottom], [left]]
    constructor(characterSize, hitboxSize, startCoord, endCoord, mazeMap) {
        this.#state = STATE.IDLE;
        this.#direction = DIRECTION.IDLE;
        this.#characterSize = [].concat(characterSize);
        this.#hitboxSize = [].concat(hitboxSize);
        this.#speed = 1;
        this.#currentHitboxCoordinate = [].concat(startCoord)
        this.#currentRenderCoordinate = [].concat(this.#currentHitboxCoordinate);
        this.#currentRenderCoordinate[1] = this.#currentRenderCoordinate[1] + Math.floor(this.#characterSize[1] / 2);
        this.#endCoordinate = [].concat(endCoord)
        this.#mazeMap = mazeMap;
        // console.log("this.#currentCoordinate = ", this.#currentCoordinate);
        // this.#setHitboxWall();
    }

    #setHitboxWall() {
        this.#hitboxWall = [[], [], [], []];
        let halfWidth = Math.floor(this.#hitboxSize[0] / 2);
        for (let i = this.#currentHitboxCoordinate[0] - halfWidth; i <= this.#currentHitboxCoordinate[0] + halfWidth; i++) {
            this.#hitboxWall[0].push([i, this.#currentHitboxCoordinate[1] + this.#hitboxSize[1]]);
            this.#hitboxWall[2].push([i, this.#currentHitboxCoordinate[1] - this.#hitboxSize[1]]);
        }
        let halfHeight = Math.floor(this.#hitboxSize[1] / 2);
        for (let i = this.#currentHitboxCoordinate[1] - halfHeight; i <= this.#currentHitboxCoordinate[1] + halfHeight; i++) {
            this.#hitboxWall[1].push([this.#currentHitboxCoordinate[0] + this.#hitboxSize[0], i]);
            this.#hitboxWall[3].push([this.#currentHitboxCoordinate[0] - this.#hitboxSize[0], i]);
        }
    }

    reset() {
        this.#state = STATE.IDLE;
        this.#direction = DIRECTION.IDLE;
    }

    #move() {
        switch (this.#direction) {
            case DIRECTION.UP:
                this.#currentHitboxCoordinate[1] += this.#speed;
                this.#currentRenderCoordinate[1] += this.#speed;
                break;
            case DIRECTION.RIGHT:
                this.#currentHitboxCoordinate[0] += this.#speed;
                this.#currentRenderCoordinate[0] += this.#speed;
                break;
            case DIRECTION.DOWN:
                this.#currentHitboxCoordinate[1] -= this.#speed;
                this.#currentRenderCoordinate[1] -= this.#speed;
                break;
            case DIRECTION.LEFT:
                this.#currentHitboxCoordinate[0] -= this.#speed;
                this.#currentRenderCoordinate[0] -= this.#speed;
                break;
        }
        return this.#currentRenderCoordinate;
    }
    
    update() {
        console.log("this.#state = ", this.#state);
        switch (this.#state) {
            case (STATE.MOVE):
                return this.#move();
            // case (STATE.WIN):
            //     console.log("isWin");
            //     this.#state = STATE.END;
            // default:
        }
        this.checkWin();
        return this.#currentRenderCoordinate;
    }

    checkWin() {
        if (this.#state !== STATE.END) {
            if (this.#currentHitboxCoordinate[0] === this.#endCoordinate[0] && this.#currentHitboxCoordinate[1] === this.#endCoordinate[1]) {
                console.log("win");
                this.#state = STATE.WIN;
                // console.log("this.#currentCoordinate = ", this.#currentCoordinate);
            }
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
        // console.log('leftDown')
        this.#state = STATE.MOVE;
        this.#direction = DIRECTION.LEFT;
    }

    right() {
        if (this.#state === STATE.WIN) {
            return;
        }
        // console.log('rightDown')
        this.#state = STATE.MOVE;
        this.#direction = DIRECTION.RIGHT;
    }

    up() {
        if (this.#state === STATE.WIN) {
            return;
        }
        // console.log('upDown')
        this.#state = STATE.MOVE;
        this.#direction = DIRECTION.UP;
    }

    down() {
        if (this.#state === STATE.WIN) {
            return;
        }
        // console.log('downDown')
        this.#state = STATE.MOVE;
        this.#direction = DIRECTION.DOWN;
    }

    stop() {
        // console.log('stop')
        this.checkWin();
        if (this.#state === STATE.MOVE) {
            this.#state = STATE.IDLE;
            this.#direction = DIRECTION.IDLE;
        }
    }
}

export default stateMachine;