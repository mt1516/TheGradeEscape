import Game from '../game/game';

class Canvas {
    constructor(container) {
        this.game = new Game(container);
        this.game.run();
    }
}

export default Canvas;