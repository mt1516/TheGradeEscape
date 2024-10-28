import Game from '../game/game';

class Canvas {
    constructor(container) {
        this.game = new Game(container);
    }
}

export default Canvas;