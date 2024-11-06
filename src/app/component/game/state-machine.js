const STATE = Object.freeze({
    IDLE: 0,
    // ACCEREATE: 1,    // TODO: Implement this state
    MOVE: 1,
    // BRAKE: 3,        // TODO: Implement this state
    DEAD: 2,            // TODO: Implement this state
    WIN: 3,
});

const DIRECTION = Object.freeze({
    IDLE: 0,
    UP: 1,
    RIGHT: 2,
    DOWN: 3,
    LEFT: 4,
});

class stateMachine {
    #state
    #speed
    #direction
    constructor() {
        this.#state = STATE.IDLE;
        this.#direction = DIRECTION.IDLE;
    }

    reset() {
        this.#state = STATE.IDLE;
        this.#direction = DIRECTION.IDLE;
    }

    move() {
        if (this.#state === STATE.IDLE) {
            this.#state = STATE.MOVE;
        }
    }

    checkWin(coordinate, winCoordinate) {
        if (coordinate[0] === winCoordinate[0] && coordinate[1] === winCoordinate[1]) {
            this.#state = STATE.WIN;
        }
    }

    isWin() {
        return (this.#state === STATE.WIN);
    }

    left() {
        this.#direction = DIRECTION.LEFT;
        this.move();
    }

    right() {
        this.#direction = DIRECTION.RIGHT;
        this.move();
    }

    up() {
        this.#direction = DIRECTION.UP;
        this.move();
    }

    down() {
        this.#direction = DIRECTION.DOWN;
        this.move();
    }
}

export default stateMachine;