import React from 'react';
import { createRoot } from 'react-dom/client';
import Game from '../game/game';
import MainMenu from './mainMenu';
import LevelMenu from './levelMenu';
import Credit from './credit';

class Canvas {
    constructor(container) {
        this.container = container;
        // this.game = new Game(container);
        this.root = createRoot(container);
        this.displayMainMenu();
    }

    displayMainMenu() {
        this.root.render(
            <MainMenu 
                onStartGame={() => this.displayLevelMenu()}
                onSelectCharacter={() => console.log('Character select')}
                onViewCredits={() => this.displayCredits()}
            />
        );
    }

    displayLevelMenu() {
        this.root.render(
            <LevelMenu 
            onDBTWeasy={() => this.refreshGame("DBTW", "easy")}
            onDBTWmedium={() => this.refreshGame("DBTW", "medium")}
            onDBTWhard={() => this.refreshGame("DBTW", "hard")}
            />
        );
    }

    displayCredits() {
        this.root.render(
            <Credit />
        );
    }

    
    refreshGame(gameType, difficulty) {
        this.root.render(null);
        this.game = new Game(this.container, gameType, difficulty);
        this.root.render(this.game.run());
    }
}

export default Canvas;